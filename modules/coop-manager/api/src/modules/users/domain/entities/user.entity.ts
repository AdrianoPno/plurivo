import { UserProps, User as SharedUser } from "@shared/types/user";

export interface UserDomainProps extends UserProps {
  unidadeId: string;
  unidadeNome?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export class User extends SharedUser {
  constructor(public override props: UserDomainProps) {
    super(props);
  }
}
