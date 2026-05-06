import { ResearchRepository } from "@/domain/repositories/ResearchRepository.js";
import {
  Research,
  ResearchProps,
  Artifact,
} from "@/domain/entities/Research.js";
import {
  getDatabase,
  DocumentNotFoundException,
} from "@shared/firebase/admin.js";
import {
  Timestamp,
  Query,
  CollectionReference,
} from "firebase-admin/firestore";
import { ListResearchQuery } from "@/interfaces/http/schemas/research.schema.js";

type FirestoreResearchData = Omit<
  ResearchProps,
  "startDate" | "estimatedEndDate" | "actualEndDate" | "createdAt" | "updatedAt"
> & {
  titleNormalized: string;
  startDate: Timestamp;
  estimatedEndDate: Timestamp;
  actualEndDate: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export class FirestoreResearchRepository implements ResearchRepository {
  private collection = getDatabase().collection(
    "researches",
  ) as CollectionReference<FirestoreResearchData>;

  private normalizeString(str: string): string {
    if (!str) return "";
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  async save(research: Research): Promise<Research> {
    const data = this.mapToDatabase(research.props);

    // Deixa o Firestore gerar o ID
    const docRef = await this.collection.add(data);

    // Retorna uma nova instância de Research que reflete o estado salvo,
    // incluindo as datas de criação/atualização geradas.
    const savedProps = this.mapFromDatabase(data);
    return new Research(savedProps, docRef.id);
  }

  async findById(id: string): Promise<Research | null> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) return null;

    return new Research(
      this.mapFromDatabase(doc.data() as FirestoreResearchData),
      doc.id,
    );
  }

  async listAll(filters?: ListResearchQuery): Promise<{
    researches: Research[];
    nextCursor?: string;
  }> {
    let query: Query = this.collection;

    // Filtros Dinâmicos
    if (filters?.status) {
      query = query.where("status", "==", filters.status);
    }

    if (filters?.location) {
      query = query.where("location", "==", filters.location);
    }

    if (filters?.tag) {
      // Busca dentro do array de tags do documento
      query = query.where("tags", "array-contains", filters.tag);
    }

    // Filtro "começa com" para o título, case-insensitive e accent-insensitive
    if (filters?.title) {
      const normalizedTitle = this.normalizeString(filters.title);
      query = query
        .where("titleNormalized", ">=", normalizedTitle)
        .where("titleNormalized", "<=", normalizedTitle + "\uf8ff");
    }

    // Ordenação padrão por data de criação
    query = query.orderBy("createdAt", "desc");

    // Paginação com cursor
    if (filters?.startAfter) {
      const lastVisibleDoc = await this.collection
        .doc(filters.startAfter)
        .get();
      if (lastVisibleDoc.exists) {
        query = query.startAfter(lastVisibleDoc);
      }
    }

    const limit = filters?.limit ?? 9; // Padrão de 9 para uma grade 3x3
    query = query.limit(limit + 1); // Busca um item a mais para verificar se há próxima página

    const snapshot = await query.get();

    const hasNextPage = snapshot.docs.length > limit;
    const docsToReturn = hasNextPage
      ? snapshot.docs.slice(0, limit)
      : snapshot.docs;

    const researches = docsToReturn.map(
      (doc) =>
        new Research(
          this.mapFromDatabase(doc.data() as FirestoreResearchData),
          doc.id,
        ),
    );

    const nextCursor = hasNextPage
      ? docsToReturn[docsToReturn.length - 1].id
      : undefined;

    return { researches, nextCursor };
  }

  async update(id: string, data: Partial<ResearchProps>): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new DocumentNotFoundException(`Research with ID ${id} not found.`);
    }

    // Destrutura todos os campos de data para garantir que não sejam passados
    // diretamente via 'restOfData', evitando conflitos de tipo (Date vs Timestamp).
    const {
      startDate,
      estimatedEndDate,
      actualEndDate,
      createdAt, // Ignorado para impedir a atualização da data de criação.
      updatedAt, // Ignorado pois será definido como Timestamp.now().
      ...restOfData
    } = data;

    const dataToUpdate: Partial<FirestoreResearchData> = {
      ...restOfData,
      updatedAt: Timestamp.now(),
    };

    if (data.title) {
      dataToUpdate.titleNormalized = this.normalizeString(data.title);
    }

    if (startDate) {
      dataToUpdate.startDate = Timestamp.fromDate(startDate);
    }
    if (estimatedEndDate) {
      dataToUpdate.estimatedEndDate = Timestamp.fromDate(estimatedEndDate);
    }
    if (data.hasOwnProperty("actualEndDate")) {
      dataToUpdate.actualEndDate = actualEndDate
        ? Timestamp.fromDate(actualEndDate)
        : null;
    }

    await docRef.update(dataToUpdate);
  }

  async delete(id: string): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new DocumentNotFoundException(`Research with ID ${id} not found.`);
    }
    await docRef.delete();
  }

  private mapToDatabase(props: ResearchProps) {
    return {
      ...props,
      titleNormalized: this.normalizeString(props.title),
      startDate: Timestamp.fromDate(props.startDate),
      estimatedEndDate: Timestamp.fromDate(props.estimatedEndDate),
      actualEndDate: props.actualEndDate
        ? Timestamp.fromDate(props.actualEndDate)
        : null,
      createdAt: props.createdAt
        ? Timestamp.fromDate(props.createdAt)
        : Timestamp.now(),
      updatedAt: Timestamp.now(), // Ensure updatedAt is always set on creation/save
    };
  }

  private mapFromDatabase(data: FirestoreResearchData): ResearchProps {
    return {
      ...data,
      startDate: data.startDate.toDate(),
      estimatedEndDate: data.estimatedEndDate.toDate(),
      actualEndDate: data.actualEndDate?.toDate() || null,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      // Garante que artifacts seja sempre Artifact[], tratando dados legados (string[])
      artifacts: Array.isArray(data.artifacts)
        ? data.artifacts.map((artifact: string | Artifact) => {
            // Se for string, converte para { url: string }, senão, usa o objeto existente
            return typeof artifact === "string" ? { url: artifact } : artifact;
          })
        : [], // Se não houver artifacts ou não for array, retorna array vazio
    };
  }
}
