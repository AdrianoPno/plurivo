import { ListResearchQuery } from "@/interfaces/http/schemas/research.schema.js";
import { Research, ResearchProps } from "../entities/Research.js";

export interface ResearchRepository {
  save(research: Research): Promise<Research>;
  findById(id: string): Promise<Research | null>;
  update(id: string, data: Partial<ResearchProps>): Promise<void>;
  listAll(filters?: ListResearchQuery): Promise<{
    researches: Research[];
    nextCursor?: string;
  }>;
  delete(id: string): Promise<void>;
}
