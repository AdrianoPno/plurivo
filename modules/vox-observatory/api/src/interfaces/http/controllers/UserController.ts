import { GetUserProfile } from "@/application/use-cases/GetUserProfile.js";
import { UpdateUserProfile } from "@/application/use-cases/UpdateUserProfile.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateUserBody } from "../schemas/user.schema.js";

type AuthenticatedUser = {
  id: string;
  email?: string;
  role?: string;
  status?: string;
  ativo?: boolean;
};

function getAuthenticatedUser(
  request: FastifyRequest,
): AuthenticatedUser | null {
  const user = request.user as AuthenticatedUser | null | undefined;

  if (!user?.id) {
    return null;
  }

  return user;
}

export class UserController {
  constructor(
    private getUserProfileUseCase: GetUserProfile,
    private updateUserProfileUseCase: UpdateUserProfile,
  ) {}

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return reply.status(401).send({
        message: "Usuário não autenticado.",
      });
    }

    const profile = await this.getUserProfileUseCase.execute(user.id);

    return reply.send({
      ...profile.props,
      email: profile.props.email || user.email || "",
      role: user.role ?? profile.props.role,
      ativo: user.ativo ?? profile.props.ativo,
      status:
        user.ativo === false || profile.props.status === "inativo"
          ? "inativo"
          : "ativo",
    });
  }

  async updateProfile(
    request: FastifyRequest<{ Body: UpdateUserBody }>,
    reply: FastifyReply,
  ) {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return reply.status(401).send({
        message: "Usuário não autenticado.",
      });
    }

    const updatedUser = await this.updateUserProfileUseCase.execute({
      uid: user.id,
      data: request.body,
    });

    return reply.send(updatedUser.props);
  }
}
