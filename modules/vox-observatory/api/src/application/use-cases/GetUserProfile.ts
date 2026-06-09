import { User } from "@/domain/entities/User.js";
import { UserRepository } from "@/domain/repositories/UserRepository.js";
import { AppError } from "@shared/utils/app-error.js";

export class GetUserProfile {
  constructor(private userRepository: UserRepository) {}

  async execute(uid: string): Promise<User> {
    const user = await this.userRepository.findByUid(uid);

    if (!user) {
      throw new AppError("Usuario sem perfil no Vox Observatory.", 403);
    }

    return user;
  }
}
