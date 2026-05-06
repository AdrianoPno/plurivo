import { User } from "@/domain/entities/User.js";
import { UserRepository } from "@/domain/repositories/UserRepository.js";
import { DocumentNotFoundException } from "@shared/firebase/admin.js";

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
