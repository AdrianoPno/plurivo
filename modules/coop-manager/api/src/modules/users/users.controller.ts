import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { ICreateUserDTO, IUpdateUserDTO } from "./usuario.types";
import { CreateUserUseCase } from "./application/use-cases/create-user.use-case.js";
import { ListUsersUseCase } from "./application/use-cases/list-users.use-case.js";
import { GetUserUseCase } from "./application/use-cases/get-user.use-case.js";
import { UpdateUserUseCase } from "./application/use-cases/update-user.use-case.js";
import { DeleteUserUseCase } from "./application/use-cases/delete-user.use-case.js";

/**
 * Tipo auxiliar para solicitações autenticadas no Fastify.
 * O ZodTypeProvider permite que o Fastify infira os tipos de body/params/query automaticamente.
 */
type FastifyZodRequest<
  T extends RouteGenericInterface = RouteGenericInterface,
> = FastifyRequest<T, any, any, any, ZodTypeProvider>;

export class UsersController {
  constructor(
    private listUsersUseCase: ListUsersUseCase,
    private getUserUseCase: GetUserUseCase,
    private createUserUseCase: CreateUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
  ) {}

  async index(req: FastifyZodRequest, reply: FastifyReply) {
    const users = await this.listUsersUseCase.execute(req.user);

    return reply.status(200).send({
      success: true,
      data: users,
      message: "Usuários listados com sucesso.",
    });
  }

  // Detalha um usuário
  async show(
    req: FastifyZodRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;

    const user = await this.getUserUseCase.execute(id, req.user);

    return reply.status(200).send({
      success: true,
      data: user,
      message: "Usuário recuperado com sucesso.",
    });
  }

  // Cria um novo usuário
  async store(
    req: FastifyZodRequest<{ Body: ICreateUserDTO }>,
    reply: FastifyReply,
  ) {
    const newUserUid = await this.createUserUseCase.execute(req.body, req.user);

    return reply.status(201).send({
      success: true,
      message: "Usuário criado com sucesso.",
      data: { uid: newUserUid },
    });
  }

  // Atualiza status ou permissão
  async update(
    req: FastifyZodRequest<{ Params: { id: string }; Body: IUpdateUserDTO }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;
    const body = req.body;

    await this.updateUserUseCase.execute(id, body, req.user);

    return reply.status(200).send({
      success: true,
      message: "Usuário atualizado com sucesso.",
    });
  }

  // Exclui um usuário
  async delete(
    req: FastifyZodRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;

    await this.deleteUserUseCase.execute(id, req.user);

    return reply.status(200).send({
      success: true,
      message: "Usuário excluído com sucesso.",
    });
  }
}
