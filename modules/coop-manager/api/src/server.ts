import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import routes from "./routes.js";
import { authPlugin } from "./plugins/auth.plugin.js";
import { setupSwagger } from "./config/swagger.js";
import { errorHandler } from "@shared/utils/error-handler.js";
import logger from "./config/logger";

const app = Fastify({ logger });

async function bootstrap() {
  // Configuração de compiladores Zod para validação e serialização automática
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Middlewares Nativos do Fastify
  await app.register(helmet, { contentSecurityPolicy: false });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "15m",
  });

  await app.register(cors, {
    origin: ["http://localhost:3003", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Plugin de Autenticação (Padrão Vox)
  await app.register(authPlugin);

  // Configura a documentação Swagger no Fastify para seguir o padrão do vox-observatory
  // A documentação estará disponível em /docs (em vez de /api-docs)
  await setupSwagger(app);

  // Registro das Rotas (agora como plugins nativos do Fastify)
  // Nota: Você precisará refatorar o arquivo 'src/routes.ts' e os arquivos de rotas
  // individuais para usarem o padrão de plugin do Fastify: async (app) => { ... }
  await app.register(routes, { prefix: "/api" });

  // Tratamento de erros global (Substituindo o errorMiddleware do Express)
  app.setErrorHandler(errorHandler as any);

  const PORT = Number(process.env.PORT || 3004);

  await app.listen({ port: PORT, host: "0.0.0.0" });
  logger.info(`Servidor rodando na porta ${PORT}`);
}

bootstrap().catch((error) => {
  logger.error(error);
  process.exit(1);
});
