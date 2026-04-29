import { z } from "zod";

export const getUploadUrlSchema = {
  description: "Gera uma URL assinada para upload de arquivos",
  tags: ["Storage"],
  security: [{ bearerAuth: [] }],
  body: z.object({
    fileName: z.string(),
    contentType: z.string(), // ex: image/jpeg, application/pdf
    researchId: z.string(),
  }),
  response: {
    200: z.object({
      uploadUrl: z.string(),
      fileUrl: z.string(), // URL final onde o arquivo ficará
    }),
  },
};

export type GetUploadUrlBody = z.infer<typeof getUploadUrlSchema.body>;
