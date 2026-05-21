import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { AuthController } from "./auth.controller.js";

export default async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController();
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  /**
   * @openapi
   * /auth/me:
   *   get:
   *     summary: Retorna o perfil do usuário autenticado
   *     description: Verifica o token JWT, busca os dados do usuário no Firestore (incluindo role e unidadeId) e retorna o perfil completo.
   *     tags:
   *       - Autenticação
   *     responses:
   *       '200':
   *         description: Perfil do usuário retornado com sucesso.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/IUser'
   *       '401':
   *         description: Não autorizado (token inválido, expirado ou não fornecido).
   *       '403':
   *         description: Proibido (usuário autenticado mas sem perfil no sistema).
   */
  typedApp.get(
    "/me",
    {
      schema: {
        summary: "Retorna o perfil do usuário autenticado",
        tags: ["Autenticação"],
      },
      preHandler: [app.authenticate],
    },
    (req, reply) => controller.me(req, reply),
  );
}
