import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { CooperadosService } from "./cooperados.service";
import { ICreateCooperadoDTO, IUpdateCooperadoDTO } from "./cooperado.types";

const cooperadosService = new CooperadosService();

/**
 * Tipo auxiliar para solicitações validadas pelo Zod no Fastify.
 */
type FastifyZodRequest<
  T extends RouteGenericInterface = RouteGenericInterface,
> = FastifyRequest<T, any, any, any, ZodTypeProvider>;

export class CooperadosController {
  async index(req: FastifyZodRequest, reply: FastifyReply) {
    // O service agora lida com a lógica de role (ADMIN vs SUPER)
    const cooperados = await cooperadosService.list(req.user!);

    return reply.status(200).send({
      success: true,
      data: cooperados,
      message: "Cooperados listados com sucesso.",
    });
  }

  async show(
    req: FastifyZodRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;

    const cooperado = await cooperadosService.getById(id, req.user!);

    return reply.status(200).send({
      success: true,
      data: cooperado,
      message: "Cooperado recuperado com sucesso.",
    });
  }

  async store(
    req: FastifyZodRequest<{ Body: ICreateCooperadoDTO }>,
    reply: FastifyReply,
  ) {
    // Passa o objeto 'user' inteiro para o service lidar com a lógica de multi-tenancy
    const id = await cooperadosService.create(req.body, req.user!);

    return reply.status(201).send({
      success: true,
      data: { id },
      message: "Cooperado criado com sucesso.",
    });
  }

  async update(
    req: FastifyZodRequest<{
      Params: { id: string };
      Body: IUpdateCooperadoDTO;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;
    await cooperadosService.update(id, req.body, req.user!);

    return reply.status(200).send({
      success: true,
      message: "Cooperado atualizado com sucesso.",
    });
  }

  async delete(
    req: FastifyZodRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;

    await cooperadosService.delete(id, req.user!);

    return reply.status(200).send({
      success: true,
      message: "Cooperado excluído com sucesso.",
    });
  }
}
