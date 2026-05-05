import { Research } from "@/domain/entities/Research";
import { ResearchRepository } from "@/domain/repositories/ResearchRepository";
import { DocumentNotFoundException } from "@/infra/database/firestore";

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
