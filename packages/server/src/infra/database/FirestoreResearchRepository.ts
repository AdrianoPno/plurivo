import { ResearchRepository } from "../../domain/repositories/ResearchRepository";
import {
  Research,
  ResearchProps,
  Artifact,
} from "../../domain/entities/Research";
import { getDatabase, DocumentNotFoundException } from "./firestore";
import { Timestamp, Query } from "firebase-admin/firestore";
import { ListResearchQuery } from "../../interfaces/http/schemas/research.schema";

type FirestoreResearchData = Omit<
  ResearchProps,
  "startDate" | "estimatedEndDate" | "actualEndDate" | "createdAt" | "updatedAt"
> & {
  startDate: Timestamp;
  estimatedEndDate: Timestamp;
  actualEndDate: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export class FirestoreResearchRepository implements ResearchRepository {
  private collection = getDatabase().collection("researches");

  async save(research: Research): Promise<Research> {
    const data = this.mapToDatabase(research.props);

    // Deixa o Firestore gerar o ID
    const docRef = await this.collection.add(data);
    return new Research(research.props, docRef.id);
  }

  async findById(id: string): Promise<Research | null> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) return null;

    return new Research(
      this.mapFromDatabase(doc.data() as FirestoreResearchData),
      doc.id,
    );
  }

  async listAll(filters?: ListResearchQuery): Promise<Research[]> {
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

    // Ordenação padrão por data de criação
    const snapshot = await query.orderBy("createdAt", "desc").get();

    return snapshot.docs.map(
      (doc) =>
        new Research(
          this.mapFromDatabase(doc.data() as FirestoreResearchData),
          doc.id,
        ),
    );
  }

  async update(id: string, data: Partial<ResearchProps>): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new DocumentNotFoundException(`Research with ID ${id} not found.`);
    }

    const { startDate, estimatedEndDate, actualEndDate, ...restOfData } = data;

    const dataToUpdate: { [key: string]: any } = {
      ...restOfData,
      updatedAt: Timestamp.now(),
    };

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
