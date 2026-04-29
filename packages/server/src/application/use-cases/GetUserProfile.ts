import { User } from "@/domain/entities/User";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { DocumentNotFoundException } from "@/infra/database/firestore";

export class GetUserProfile {
  constructor(private userRepository: UserRepository) {}

  async execute(uid: string): Promise<User> {
    const user = await this.userRepository.findByUid(uid);

    if (!user) {
      throw new DocumentNotFoundException(`User with UID ${uid} not found.`);
    }

    return user;
  }
}
