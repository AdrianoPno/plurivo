import { firestore as db } from "@shared/firebase/admin.js";
import { IUnidade, IUpdateUnidadeDTO } from "../../unidades.types.js";
import { IUnidadeRepository } from "../../domain/repositories/unidade.repository.js";

export class FirestoreUnidadeRepository implements IUnidadeRepository {
  private collection = db.collection("unidades");

  async list(): Promise<IUnidade[]> {
    const snapshot = await this.collection.orderBy("nome", "asc").get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate
        ? doc.data().createdAt.toDate()
        : doc.data().createdAt,
    })) as IUnidade[];
  }

  async getById(id: string): Promise<IUnidade | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as IUnidade;
  }

  async save(unidade: Omit<IUnidade, "id">): Promise<string> {
    const docRef = await this.collection.add({
      ...unidade,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  }

  async update(id: string, data: IUpdateUnidadeDTO): Promise<void> {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
