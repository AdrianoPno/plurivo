import { FastifyReply, FastifyRequest } from "fastify";
import {
  LoginUser,
  InvalidCredentialsError,
} from "@/application/use-cases/LoginUser.js";
import { LoginBody } from "../schemas/auth.schema.js";

export class AuthController {
  constructor(private loginUserUseCase: LoginUser) {}

  async login(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply,
  ) {
    try {
      const user = await this.loginUserUseCase.execute(request.body);

      // Gera o token JWT interno da sua API, incluindo role e status
      const token = await reply.jwtSign(
        {
          id: user.props.uid,
          email: user.props.email,
          role: user.props.role,
          status: user.props.status,
        },
        { expiresIn: "1h" }, // Token expira em 1 hora
      );

      return reply.status(200).send({ token });
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.status(401).send({ message: error.message });
      }
      throw error; // Deixa outros erros serem tratados pelo Global Error Handler
    }
  }
}
