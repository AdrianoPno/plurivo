import { ResearchRepository } from "@/domain/repositories/ResearchRepository.js";
import { DocumentNotFoundException } from "@shared/firebase/admin.js";

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
