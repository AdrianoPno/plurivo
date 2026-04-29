export interface UserProps {
  id: string;
  email: string;
  passwordHash: string; // Senha já hashed
  // Outras propriedades do usuário, como nome, roles, etc.
}

export class User {
  public readonly props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }
}
