import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { StorageController } from "../controllers/StorageController";
import { getUploadUrlSchema } from "../schemas/storage.schema";

const controller = new StorageController();

export async function storageRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post(
    "/storage/upload-url",
    {
      schema: getUploadUrlSchema,
      preHandler: [app.authenticate],
    },
    controller.getUploadUrl.bind(controller),
  );
}
