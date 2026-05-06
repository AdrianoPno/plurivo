import { FastifyReply, FastifyRequest } from "fastify";
import { GetUploadUrlBody } from "../schemas/storage.schema.js";
import { getBucket } from "@shared/firebase/firestore.js";

export class StorageController {
  async getUploadUrl(
    request: FastifyRequest<{ Body: GetUploadUrlBody }>,
    reply: FastifyReply,
  ) {
    const { fileName, contentType, researchId } = request.body;
    const bucket = getBucket();

    // Caminho organizado: researches/id-da-pesquisa/nome-do-arquivo
    const filePath = `researches/${researchId}/${Date.now()}-${fileName}`;
    const file = bucket.file(filePath);

    // Gera URL assinada válida por 15 minutos
    const [uploadUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
      contentType,
    });

    return reply.send({
      uploadUrl,
      fileUrl: `https://storage.googleapis.com/${bucket.name}/${filePath}`,
    });
  }
}
