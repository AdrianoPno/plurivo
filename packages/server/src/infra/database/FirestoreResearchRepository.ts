import { ResearchRepository } from "../../domain/repositories/ResearchRepository";
import { Research, ResearchProps } from "../../domain/entities/Research";
import { getDatabase, DocumentNotFoundException } from "./firestore";
import { Timestamp, Query } from "firebase-admin/firestore";
import { ListResearchQuery } from "../../interfaces/http/schemas/research.schema";

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

    return new Research(this.mapFromDatabase(doc.data() as any), doc.id);
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
      (doc) => new Research(this.mapFromDatabase(doc.data() as any), doc.id),
    );
  }

  async update(id: string, data: Partial<ResearchProps>): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new DocumentNotFoundException(`Research with ID ${id} not found.`);
    }

    // Map only the provided data fields to database format
    const dataToUpdate: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        dataToUpdate[key] = this.mapToDatabaseField(key, (data as any)[key]);
      }
    }
    dataToUpdate.updatedAt = Timestamp.now(); // Always update `updatedAt`

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

  private mapFromDatabase(data: any): ResearchProps {
    return {
      ...data,
      startDate: data.startDate.toDate(),
      estimatedEndDate: data.estimatedEndDate.toDate(),
      actualEndDate: data.actualEndDate?.toDate() || null,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  }

  // Helper to map individual fields for partial updates
  private mapToDatabaseField(key: string, value: any): any {
    if (value instanceof Date) {
      return Timestamp.fromDate(value);
    }
    // Specific handling for fields that might be Date objects
    if (
      [
        "startDate",
        "estimatedEndDate",
        "actualEndDate",
        "createdAt",
        "updatedAt",
      ].includes(key) &&
      value
    ) {
      if (typeof value === "string") {
        return Timestamp.fromDate(new Date(value));
      }
      return Timestamp.fromDate(value);
    }
    return value;
  }
}
