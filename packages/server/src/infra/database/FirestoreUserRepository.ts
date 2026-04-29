import { User, UserProps } from "@/domain/entities/User";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { getDatabase } from "./firestore";

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
