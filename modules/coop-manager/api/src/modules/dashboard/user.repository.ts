import { IUser, IUpdateUserDTO } from "../users/usuario.types";

export interface IUserRepository {
  list(unidadeId?: string): Promise<IUser[]>;
  getById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  save(user: Omit<IUser, "id">): Promise<void>;
  update(uid: string, data: IUpdateUserDTO): Promise<void>;
  delete(uid: string): Promise<void>;
}
