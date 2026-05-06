export const APP = {
  NAME: "VOX Platform",

  DESCRIPTION: "Plataforma modular corporativa da Recicleiros",

  VERSION: "1.0.0",

  COMPANY: "Recicleiros",

  DEFAULT_LANGUAGE: "pt-BR",

  DEFAULT_TIMEZONE: "America/Sao_Paulo",

  SUPPORT_EMAIL: "drisays@gmail.com",

  STORAGE_PREFIX: "vox",

  PAGINATION: {
    DEFAULT_PAGE: 1,

    DEFAULT_LIMIT: 10,

    MAX_LIMIT: 100,
  },

  DATE_FORMATS: {
    DEFAULT: "dd/MM/yyyy",

    DATETIME: "dd/MM/yyyy HH:mm",
  },
} as const;
