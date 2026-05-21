import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { ListUnidadesUseCase } from "./application/use-cases/list-unidades.use-case.js";
import { CreateUnidadeUseCase } from "./application/use-cases/create-unidade.use-case.js";
import { GetUnidadeUseCase } from "./application/use-cases/get-unidade.use-case.js";
import { UpdateUnidadeUseCase } from "./application/use-cases/update-unidade.use-case.js";
import { DeleteUnidadeUseCase } from "./application/use-cases/delete-unidade.use-case.js";
import { ICreateUnidadeDTO, IUpdateUnidadeDTO } from "./unidades.types.js";

/**
 * Tipo auxiliar para solicitações validadas pelo Zod no Fastify.
 */
type FastifyZodRequest<
  T extends RouteGenericInterface = RouteGenericInterface,
> = FastifyRequest<T, any, any, any, ZodTypeProvider>;

export class UnidadesController {
  constructor(
    private listUnidadesUseCase: ListUnidadesUseCase,
    private getUnidadeUseCase: GetUnidadeUseCase,
    private createUnidadeUseCase: CreateUnidadeUseCase,
    private updateUnidadeUseCase: UpdateUnidadeUseCase,
    private deleteUnidadeUseCase: DeleteUnidadeUseCase,
  ) {}

  async index(req: FastifyZodRequest, reply: FastifyReply) {
    const unidades = await this.listUnidadesUseCase.execute();
    return reply.status(200).send({
      success: true,
      data: unidades,
    });
  }

  async show(
    req: FastifyZodRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;
    const unidade = await this.getUnidadeUseCase.execute(id);
    return reply.status(200).send({
      success: true,
      data: unidade,
    });
  }

  async store(
    req: FastifyZodRequest<{ Body: ICreateUnidadeDTO }>,
    reply: FastifyReply,
  ) {
    const id = await this.createUnidadeUseCase.execute(req.body);
    return reply.status(201).send({
      success: true,
      data: { id },
      message: "Unidade criada com sucesso.",
    });
  }

  async update(
    req: FastifyZodRequest<{ Params: { id: string }; Body: IUpdateUnidadeDTO }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;
    await this.updateUnidadeUseCase.execute(id, req.body);
    return reply.status(200).send({
      success: true,
      message: "Unidade atualizada com sucesso.",
    });
  }

  async delete(
    req: FastifyZodRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = req.params;
    await this.deleteUnidadeUseCase.execute(id);
    return reply.status(200).send({
      success: true,
      message: "Unidade excluída com sucesso.",
    });
  }
}
