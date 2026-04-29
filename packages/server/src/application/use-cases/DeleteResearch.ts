import { ResearchRepository } from "@/domain/repositories/ResearchRepository";
import { DocumentNotFoundException } from "@/infra/database/firestore";

export class DeleteResearch {
  constructor(private researchRepository: ResearchRepository) {}

  async execute(id: string): Promise<void> {
    const existingResearch = await this.researchRepository.findById(id);

    if (!existingResearch) {
      throw new DocumentNotFoundException(`Research with ID ${id} not found.`);
    }

    await this.researchRepository.delete(id);
  }
}
