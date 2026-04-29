import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { AuthController } from "../controllers/AuthController";
import { authSchemas } from "../schemas/auth.schema";
import { LoginUser } from "@/application/use-cases/LoginUser";

export async function authRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  const loginUserUseCase = new LoginUser();
  const controller = new AuthController(loginUserUseCase);

  app.post(
    "/sessions",
    {
      schema: {
        description: "Autentica um usuário e retorna um token JWT",
        tags: ["Auth"],
        body: authSchemas.loginBodySchema,
        response: { 200: authSchemas.loginResponseSchema },
      },
    },
    controller.login.bind(controller),
  );
}
