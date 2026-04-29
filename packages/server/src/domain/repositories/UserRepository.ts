import { User } from "../entities/User";

export interface UserRepository {
  findByUid(uid: string): Promise<User | null>;
  save(user: User): Promise<void>; // Para criar/atualizar o perfil do usuário no Firestore
}
