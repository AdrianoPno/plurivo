import { FastifyReply, FastifyRequest } from "fastify";

export class AuthController {
  /**
   * Retorna os dados do usuário logado (Perfil + Unidade)
   * Útil para o "Me" ou "VerifySession" no Frontend
   */
  async me(req: FastifyRequest, reply: FastifyReply) {
    // O middleware de autenticação já garante que req.user exista.
    if (!req.user) {
      return reply.status(403).send({
        success: false,
        message: "Perfil de usuário não encontrado na requisição.",
      });
    }

    // Retorna os dados que o hook 'authenticate' anexou ao objeto 'req'
    return reply.status(200).send({
      success: true,
      data: req.user,
      message: "Perfil recuperado com sucesso.",
    });
  }
}
