import { GetUserProfile } from "@/application/use-cases/GetUserProfile.js";
import { UpdateUserProfile } from "@/application/use-cases/UpdateUserProfile.js";
import { FirestoreUserRepository } from "@/infra/database/FirestoreUserRepository.js";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UserController } from "../controllers/UserController.js";
import {
  userResponseSchema,
  updateUserBodySchema,
} from "../schemas/user.schema.js";

export async function userRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // Injeção de Dependências para o UserController
  const userRepository = new FirestoreUserRepository();
  const getUserProfileUseCase = new GetUserProfile(userRepository);
  const updateUserProfileUseCase = new UpdateUserProfile(userRepository);
  const controller = new UserController(
    getUserProfileUseCase,
    updateUserProfileUseCase,
  );

  app.get(
    "/me",
    {
      schema: {
        description: "Retorna o perfil do usuário autenticado",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        response: { 200: userResponseSchema },
      },
      preHandler: [app.authenticate],
    },
    controller.getProfile.bind(controller),
  );

  app.patch(
    "/me",
    {
      schema: {
        description: "Atualiza os dados do usuário autenticado",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        body: updateUserBodySchema,
        response: { 200: userResponseSchema },
      },
      preHandler: [app.authenticate],
    },
    controller.updateProfile.bind(controller),
  );
}
