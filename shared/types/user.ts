export type UserRole = "ADMIN" | "VIEWER" | "SUPER";

export type UserStatus = "ativo" | "inativo";

export interface UserProps {
  uid: string;
  nome: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export class User {
  constructor(public props: UserProps) {}

  get uid() {
    return this.props.uid;
  }

  get nome() {
    return this.props.nome;
  }

  get email() {
    return this.props.email;
  }

  get role() {
    return this.props.role;
  }

  get status() {
    return this.props.status;
  }

  isActive() {
    return this.props.status === "ativo";
  }

  isAdmin() {
    return this.props.role === "ADMIN";
  }

  isSuper() {
    return this.props.role === "SUPER";
  }

  canManageUsers() {
    return this.isAdmin() || this.isSuper();
  }
}
