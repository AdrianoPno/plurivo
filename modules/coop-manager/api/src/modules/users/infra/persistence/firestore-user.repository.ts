import { db } from "../../../../config/firebase";
import { IUser, IUpdateUserDTO } from "../../usuario.types";
import { IUserRepository } from "../../domain/repositories/user.repository.js";

export class FirestoreUserRepository implements IUserRepository {
  private collection = db.collection("users");
  private unidadesCollection = db.collection("unidades");

  async list(unidadeId?: string): Promise<IUser[]> {
    let query: FirebaseFirestore.Query = this.collection;

    if (unidadeId) {
      query = query.where("unidadeId", "==", unidadeId);
    }

    const snapshot = await query.orderBy("nome", "asc").get();

    // Busca unidades para enriquecimento (Padrão N+1 evitado)
    const unidadesSnapshot = await this.unidadesCollection.get();
    const unidadesMap = new Map(
      unidadesSnapshot.docs.map((doc) => [doc.id, doc.data().nome]),
    );

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        unidadeNome: unidadesMap.get(data.unidadeId) || data.unidadeId,
        createdAt: data?.createdAt?.toDate
          ? data.createdAt.toDate()
          : data?.createdAt,
      } as IUser;
    });
  }

  async getById(id: string): Promise<IUser | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data() as IUser;

    // Enriquecimento pontual da unidade
    if (data.unidadeId && !data.unidadeNome) {
      const unidadeDoc = await this.unidadesCollection
        .doc(data.unidadeId)
        .get();
      if (unidadeDoc.exists) data.unidadeNome = unidadeDoc.data()?.nome;
    }

    return { id: doc.id, ...data };
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const snapshot = await this.collection
      .where("email", "==", email)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as IUser;
  }

  async save(user: Omit<IUser, "id">): Promise<void> {
    await this.collection.doc(user.uid).set({
      ...user,
      updatedAt: new Date(),
    });
  }

  async update(uid: string, data: IUpdateUserDTO): Promise<void> {
    await this.collection.doc(uid).update({
      ...data,
      updatedAt: new Date(),
    });
  }

  async delete(uid: string): Promise<void> {
    await this.collection.doc(uid).delete();
  }
}
