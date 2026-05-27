export interface UserProps {
  uid: string;
  nome: string;
  email: string;
  role: "ADMIN" | "USER" | "VIEWER" | "SUPER";
  status: "ativo" | "inativo";
  ativo: boolean;
}

export class User {
  constructor(public props: UserProps) {}
}
