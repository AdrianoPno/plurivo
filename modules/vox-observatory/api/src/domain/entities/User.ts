export interface UserProps {
  uid: string;
  nome: string;
  email: string;
  role: "ADMIN" | "VIEWER" | "SUPER";
  status: "ativo" | "inativo";
}

export class User {
  constructor(public props: UserProps) {}
}
