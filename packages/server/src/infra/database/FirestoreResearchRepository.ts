import { ResearchRepository } from "../../domain/repositories/ResearchRepository";
import { Research, ResearchProps } from "../../domain/entities/Research";
import { getDatabase } from "./firestore";
import { Timestamp } from "firebase-admin/firestore";

export class FirestoreResearchRepository implements ResearchRepository {
  private collection = getDatabase().collection("researches");

  async save(research: Research): Promise<void> {
    const data = this.mapToDatabase(research.props);

    // Se a pesquisa já tiver um ID, atualiza, senão cria um novo
    const docRef = research.props.title.toLowerCase().replace(/\s+/g, "-");
    await this.collection.doc(docRef).set(data, { merge: true });
  }

  async findById(id: string): Promise<Research | null> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) return null;

    return new Research(this.mapFromDatabase(doc.data() as any), doc.id);
  }

  async listAll(): Promise<Research[]> {
    const snapshot = await this.collection.orderBy("createdAt", "desc").get();
    return snapshot.docs.map(
      (doc) => new Research(this.mapFromDatabase(doc.data() as any), doc.id),
    );
  }

  // Mapeia de Entidade (JS Date) -> Firestore (Timestamp)
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
      updatedAt: Timestamp.now(),
    };
  }

  // Mapeia de Firestore (Timestamp) -> Entidade (JS Date)
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
}
