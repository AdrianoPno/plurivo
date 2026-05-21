import {
  IUnidade,
  ICreateUnidadeDTO,
  IUpdateUnidadeDTO,
} from "../../unidades.types";

export interface IUnidadeRepository {
  list(): Promise<IUnidade[]>;
  getById(id: string): Promise<IUnidade | null>;
  save(unidade: Omit<IUnidade, "id">): Promise<string>;
  update(id: string, data: IUpdateUnidadeDTO): Promise<void>;
  delete(id: string): Promise<void>;
}
