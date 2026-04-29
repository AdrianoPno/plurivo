import { Research } from "../entities/Research";

export interface ResearchRepository {
  save(research: Research): Promise<void>;
  findById(id: string): Promise<Research | null>;
  listAll(): Promise<Research[]>;
}
