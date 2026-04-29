import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UserController } from "../controllers/UserController";
import { GetUserProfile } from "@/application/use-cases/GetUserProfile";
import { FirestoreUserRepository } from "@/infra/database/FirestoreUserRepository";
import { userSchemas } from "../schemas/user.schema";

export async function userRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // Injeção de Dependências para o UserController
  const userRepository = new FirestoreUserRepository();
  const getUserProfileUseCase = new GetUserProfile(userRepository);
  const controller = new UserController(getUserProfileUseCase);

  app.get(
    "/me",
    {
      schema: {
        description: "Retorna o perfil do usuário autenticado",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        response: { 200: userSchemas.userSchema },
      },
      preHandler: [app.authenticate],
    },
    controller.getProfile.bind(controller),
  );
}
