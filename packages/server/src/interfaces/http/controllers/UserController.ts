import { FastifyReply, FastifyRequest } from "fastify";
import { GetUserProfile } from "@/application/use-cases/GetUserProfile";
import { UserType } from "../schemas/user.schema";

export class UserController {
  constructor(private getUserProfileUseCase: GetUserProfile) {}

  async getProfile(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<UserType> {
    // O 'id' no request.user é o 'uid' do Firebase, conforme definido no JWT
    const uid = request.user.id;

    const user = await this.getUserProfileUseCase.execute(uid);

    // Retorna apenas as props do usuário, que correspondem ao UserType
    return reply.send(user.props);
  }
}
