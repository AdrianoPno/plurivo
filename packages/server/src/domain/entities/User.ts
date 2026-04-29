export interface UserProps {
  uid: string; // ID único do Firebase Auth
  nome: string;
  email: string;
  role: "ADMIN" | "VIEWER" | "SUPER";
  status: "ativo" | "inativo";
}

export class User {
  constructor(public props: UserProps) {}

  // Métodos de negócio podem ser adicionados aqui, se necessário
}
