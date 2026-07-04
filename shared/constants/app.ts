export const APP = {
  NAME: "Plurivo",

  DESCRIPTION: "Gestao modular que evolui com a sua operacao",

  VERSION: "1.0.0",

  COMPANY: "Plurivo",

  DEFAULT_LANGUAGE: "pt-BR",

  DEFAULT_TIMEZONE: "America/Sao_Paulo",

  SUPPORT_EMAIL: "drisays@gmail.com",

  STORAGE_PREFIX: "plurivo",

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
