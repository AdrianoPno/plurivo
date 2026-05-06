import { User } from "../entities/User.js";

export interface UserRepository {
  findByUid(uid: string): Promise<User | null>;
  save(user: User): Promise<void>;
  update(uid: string, data: Partial<User["props"]>): Promise<void>;
}
