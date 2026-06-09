import type { IUser } from "@shared/types/user";

export interface UserDomainProps extends IUser {
  unidadeId: string;
  unidadeNome?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export class User {
  constructor(public props: UserDomainProps) {}
}
