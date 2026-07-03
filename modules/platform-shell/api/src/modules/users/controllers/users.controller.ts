import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { CreateUserUseCase } from "../create-user.use-case.js";
import { DeleteUserUseCase } from "../delete-user.use-case.js";
import { GetUserUseCase } from "../get-user.use-case.js";
import { ListUsersUseCase } from "../list-users.use-case.js";
import { ICreateUserDTO, IUpdateUserDTO } from "../types/usuario.types.js";
import { UpdateUserUseCase } from "../update-user.use-case.js";

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

  async show(
    req: FastifyZodRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;

    // 1. Recupera o usuário do UseCase (Tipo: IUser)
    const user = await this.getUserUseCase.execute(id, req.user);

    // 2. Sanitiza o payload convertendo Timestamps e tratando valores nulos
    return reply.status(200).send({
      success: true,
      message: "Usuário recuperado com sucesso.",
      data: {
        uid: user.uid || id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        ativo: user.ativo ?? true,
        tenantId: user.tenantId || null,
        unidadeId: user.unidadeId || null, // Normaliza undefined para null para casar com o schema
        permissions: user.permissions || [],
        // Converte o Timestamp do Firebase para string ISO se necessário
        createdAt:
          user.createdAt &&
          typeof user.createdAt === "object" &&
          "toDate" in user.createdAt
            ? (user.createdAt as any).toDate().toISOString()
            : user.createdAt,
        updatedAt:
          user.updatedAt &&
          typeof user.updatedAt === "object" &&
          "toDate" in user.updatedAt
            ? (user.updatedAt as any).toDate().toISOString()
            : user.updatedAt,
      },
    });
  }

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

  async update(
    req: FastifyZodRequest<{ Params: { id: string }; Body: IUpdateUserDTO }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;
    const body = req.body;

    // Executa a atualização no caso de uso
    const updatedUser = await this.updateUserUseCase.execute(
      id,
      body,
      req.user,
    );

    // Função auxiliar interna para garantir a conversão do Timestamp do Firebase para String ISO
    const parseDate = (date: any): string | undefined => {
      if (!date) return undefined;
      if (typeof date === "object" && typeof date.toDate === "function") {
        return date.toDate().toISOString();
      }
      if (date instanceof Date) {
        return date.toISOString();
      }
      return String(date);
    };

    // Retorna os dados normalizados exatamente como o Zod exige
    return reply.status(200).send({
      success: true,
      message: "Usuário atualizado com sucesso.",
      data: {
        uid: id,
        nome: updatedUser.nome || body.nome,
        email: updatedUser.email,
        role: updatedUser.role || body.role,
        ativo: updatedUser.ativo !== undefined ? updatedUser.ativo : body.ativo,
        tenantId: updatedUser.tenantId || null,
        unidadeId: updatedUser.unidadeId || null,
        permissions: updatedUser.permissions || body.permissions || [],
        createdAt: parseDate(updatedUser.createdAt),
        updatedAt: parseDate(updatedUser.updatedAt), // <--- Aqui mata o erro 500
      },
    });
  }

  async delete(
    req: FastifyZodRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;

    await this.deleteUserUseCase.execute(id, req.user);

    return reply
      .status(200)
      .send({ success: true, message: "Usuário excluído com sucesso." });
  }
}
