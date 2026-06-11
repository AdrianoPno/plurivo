export interface ICargo {
  id?: string;
  nome: string;
  limiteVagas: number;
  ativo: boolean;
  ocupadas?: number;
  disponiveis?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateCargoDTO {
  nome: string;
  limiteVagas: number;
  ativo?: boolean;
}

export type IUpdateCargoDTO = Partial<ICreateCargoDTO>;
