import { FastifyReply, FastifyRequest } from "fastify";
import { GetUserProfile } from "@/application/use-cases/GetUserProfile";
import { UpdateUserProfile } from "@/application/use-cases/UpdateUserProfile";
import { UpdateUserBody, UserType } from "../schemas/user.schema";

export class UserController {
  constructor(
    private getUserProfileUseCase: GetUserProfile,
    private updateUserProfileUseCase: UpdateUserProfile,
  ) {}

  async getProfile(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<UserType> {
    const uid = request.user.id;

    const user = await this.getUserProfileUseCase.execute(uid);

    return reply.send(user.props);
  }

  async updateProfile(
    request: FastifyRequest<{ Body: UpdateUserBody }>,
    reply: FastifyReply,
  ): Promise<UserType> {
    const uid = request.user.id;
    const data = request.body;

    const updatedUser = await this.updateUserProfileUseCase.execute({
      uid,
      data,
    });

    return reply.send(updatedUser.props);
  }
}
