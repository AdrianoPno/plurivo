import pino from "pino";

// Por padrão, os logs estão ativados. Para desativar, defina LOG_ENABLED=false no .env
const isLogEnabled = process.env.LOG_ENABLED !== "false";

// Configura o logger para ser legível em desenvolvimento e JSON em produção.
const logger = pino({
  // Se os logs estiverem desativados, o nível 'silent' impede qualquer output.
  level: isLogEnabled
    ? process.env.NODE_ENV === "production"
      ? "info"
      : "debug"
    : "silent",
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
});

export default logger;
