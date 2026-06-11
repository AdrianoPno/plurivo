import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { CargosService } from "./cargos.service.js";
import { ICreateCargoDTO, IUpdateCargoDTO } from "./cargo.types.js";

const cargosService = new CargosService();

type FastifyZodRequest<
  T extends RouteGenericInterface = RouteGenericInterface,
> = FastifyRequest<T, any, any, any, ZodTypeProvider>;

export class CargosController {
  async index(
    req: FastifyZodRequest<{ Querystring: { unidadeId?: string } }>,
    reply: FastifyReply,
  ) {
    const cargos = await cargosService.list(req.user!, req.query.unidadeId);

    return reply.status(200).send({
      success: true,
      data: cargos,
      message: "Cargos listados com sucesso.",
    });
  }

  async store(
    req: FastifyZodRequest<{ Body: ICreateCargoDTO }>,
    reply: FastifyReply,
  ) {
    const id = await cargosService.create(req.body);

    return reply.status(201).send({
      success: true,
      data: { id },
      message: "Cargo criado com sucesso.",
    });
  }

  async update(
    req: FastifyZodRequest<{ Params: { id: string }; Body: IUpdateCargoDTO }>,
    reply: FastifyReply,
  ) {
    await cargosService.update(req.params.id, req.body);

    return reply.status(200).send({
      success: true,
      message: "Cargo atualizado com sucesso.",
    });
  }

  async delete(
    req: FastifyZodRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    await cargosService.delete(req.params.id);

    return reply.status(200).send({
      success: true,
      message: "Cargo excluido com sucesso.",
    });
  }
}
