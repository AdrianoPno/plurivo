import { User } from "@/domain/entities/User";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { DocumentNotFoundException } from "@/infra/database/firestore";

interface UpdateUserProfileRequest {
  uid: string;
  data: {
    nome?: string;
  };
}

export class UpdateUserProfile {
  constructor(private userRepository: UserRepository) {}

  async execute({ uid, data }: UpdateUserProfileRequest): Promise<User> {
    const user = await this.userRepository.findByUid(uid);
    if (!user) {
      throw new DocumentNotFoundException("User not found.");
    }

    await this.userRepository.update(uid, data);

    return (await this.userRepository.findByUid(uid))!;
  }
}
