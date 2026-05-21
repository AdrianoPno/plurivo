import { FastifyInstance } from "fastify";
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { z } from "zod";
import { UsersController } from "./controllers/users.controller.js";

import { CreateUserUseCase } from "./create-user.use-case.js";
import { DeleteUserUseCase } from "./delete-user.use-case.js";
import { FirestoreUserRepository } from "./repositories/firestore-user.repository.js";
import { GetUserUseCase } from "./get-user.use-case.js";
import { ListUsersUseCase } from "./list-users.use-case.js";
import { UpdateUserUseCase } from "./update-user.use-case.js";
import {
  getUserSchema,
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
} from "./schemas/users.schema.js";

export default async function usersRoutes(app: FastifyInstance) {
  // Configuração obrigatória dos compiladores locais para o Swagger extrair os metadados do Zod
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  const userRepository = new FirestoreUserRepository();

  const controller = new UsersController(
    new ListUsersUseCase(userRepository),
    new GetUserUseCase(userRepository),
    new CreateUserUseCase(userRepository),
    new UpdateUserUseCase(userRepository),
    new DeleteUserUseCase(userRepository),
  );

  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  // Hooks de segurança
  typedApp.addHook("preHandler", app.authenticate);
  typedApp.addHook("preHandler", app.checkRoles(["SUPER", "ADMIN"]));

  // Lista Usuários
  typedApp.get(
    "/",
    {
      schema: {
        tags: ["Users"],
        summary: "Listar todos os usuários",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            success: z.boolean(),
            data: z.array(z.record(z.any())),
            message: z.string().optional(),
          }),
        },
      },
    },
    (req, reply) => controller.index(req, reply),
  );

  // Busca Usuário por ID
  typedApp.get(
    "/:id",
    {
      schema: {
        ...getUserSchema.schema, // Acessa a propriedade schema interna exposta no seu arquivo
        tags: ["Users"],
        summary: "Buscar usuário por ID",
      },
    },
    (req, reply) => controller.show(req, reply),
  );

  // Cria Usuário
  typedApp.post(
    "/",
    {
      schema: {
        ...createUserSchema.schema, // Ajustado spread correto
        tags: ["Users"],
        summary: "Criar novo usuário",
      },
    },
    (req, reply) => controller.store(req, reply),
  );

  // Atualiza Usuário
  typedApp.put(
    "/:id",
    {
      schema: {
        ...updateUserSchema.schema, // Ajustado spread correto
        tags: ["Users"],
        summary: "Atualizar dados do usuário",
      },
    },
    (req, reply) => controller.update(req, reply),
  );

  // Deleta Usuário
  typedApp.delete(
    "/:id",
    {
      schema: {
        ...deleteUserSchema.schema, // Ajustado spread correto
        tags: ["Users"],
        summary: "Remover usuário do sistema",
      },
    },
    (req, reply) => controller.delete(req, reply),
  );
}
