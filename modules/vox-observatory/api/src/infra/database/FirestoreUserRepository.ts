import { User, UserProps } from "@/domain/entities/User.js";
import { UserRepository } from "@/domain/repositories/UserRepository.js";
import {
  DocumentNotFoundException,
  getDatabase,
} from "@shared/firebase/admin.js";

export class FirestoreUserRepository implements UserRepository {
  private collection = getDatabase().collection("users");

  async findByUid(uid: string): Promise<User | null> {
    const doc = await this.collection.doc(uid).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data() as UserProps;
    return new User(data);
  }

  async save(user: User): Promise<void> {
    // O UID do Firebase Auth será o ID do documento no Firestore
    await this.collection.doc(user.props.uid).set(user.props, { merge: true });
  }

  async update(uid: string, data: Partial<UserProps>): Promise<void> {
    const docRef = this.collection.doc(uid);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new DocumentNotFoundException(`User with UID ${uid} not found.`);
    }

    // Atualiza o documento com os novos dados
    await docRef.update(data);
  }

  // Métodos de mapeamento (se necessário, para datas ou outros tipos complexos)
  // private mapToDatabase(props: UserProps) {
  //   return {
  //     ...props,
  //   };
  // }

  // private mapFromDatabase(data: any): UserProps {
  //   return {
  //     ...data,
  //   };
  // }
}
