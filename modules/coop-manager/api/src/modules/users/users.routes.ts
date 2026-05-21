import { FastifyInstance, FastifySchema } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UsersController } from "./users.controller.js";
//import { ROLES } from "@shared/types/user"; // Assumindo que você adicione o objeto ROLES para evitar strings mágicas
import {
  getUserSchema,
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
} from "./users.schema";
import { ListUsersUseCase } from "./application/use-cases/list-users.use-case.js";
import { GetUserUseCase } from "./application/use-cases/get-user.use-case.js";
import { CreateUserUseCase } from "./application/use-cases/create-user.use-case.js";
import { UpdateUserUseCase } from "./application/use-cases/update-user.use-case.js";
import { DeleteUserUseCase } from "./application/use-cases/delete-user.use-case.js";
import { FirestoreUserRepository } from "./infra/persistence/firestore-user.repository.js";

export default async function usersRoutes(
  app: FastifyInstance<any, any, any, any>,
) {
  // Instanciação das dependências (Manual Dependency Injection)
  const userRepository = new FirestoreUserRepository();

  const controller = new UsersController(
    new ListUsersUseCase(userRepository),
    new GetUserUseCase(userRepository),
    new CreateUserUseCase(userRepository),
    new UpdateUserUseCase(userRepository),
    new DeleteUserUseCase(userRepository),
  );

  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  // Protege todas as rotas deste módulo usando o decorator 'authenticate'
  typedApp.addHook("preHandler", app.authenticate);

  // Aplica a verificação de roles em massa para todas as rotas deste plugin
  typedApp.addHook("preHandler", app.checkRoles(["SUPER", "ADMIN"]));

  typedApp.get(
    "/",
    {
      schema: {
        summary: "Lista usuários da mesma unidade do administrador",
        tags: ["Usuários"],
        response: {
          200: z.object({
            success: z.boolean(),
            data: z.array(z.record(z.any())),
            message: z.string().optional(),
          }),
        },
      } satisfies FastifySchema,
    },
    (req, reply) => controller.index(req, reply),
  );

  typedApp.get(
    "/:id",
    {
      schema: {
        ...getUserSchema,
        summary: "Detalha um usuário",
        tags: ["Usuários"],
      },
    },
    (req, reply) => controller.show(req, reply),
  );

  typedApp.post(
    "/",
    {
      schema: {
        ...createUserSchema,
        summary: "Cria um novo usuário",
        tags: ["Usuários"],
      },
    },
    (req, reply) => controller.store(req, reply),
  );

  typedApp.put(
    "/:id",
    {
      schema: {
        ...updateUserSchema,
        summary: "Atualiza um usuário",
        tags: ["Usuários"],
      },
    },
    (req, reply) => controller.update(req, reply),
  );

  typedApp.delete(
    "/:id",
    {
      schema: {
        ...deleteUserSchema,
        summary: "Exclui um usuário",
        tags: ["Usuários"],
      },
    },
    (req, reply) => controller.delete(req, reply),
  );
}
