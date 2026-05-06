import { Research } from "@/domain/entities/Research.js";
import { ResearchRepository } from "@/domain/repositories/ResearchRepository.js";
import { DocumentNotFoundException } from "@shared/firebase/admin.js";

export class GetResearchById {
  constructor(private researchRepository: ResearchRepository) {}

  async execute(id: string): Promise<Research> {
    const research = await this.researchRepository.findById(id);

    if (!research) {
      throw new DocumentNotFoundException(`Research with ID ${id} not found.`);
    }

    return research;
  }
}
