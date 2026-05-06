import { APP } from "../constants/app";

export const appConfig = {
  name: APP.NAME,

  description: APP.DESCRIPTION,

  version: APP.VERSION,

  company: APP.COMPANY,

  language: APP.DEFAULT_LANGUAGE,

  timezone: APP.DEFAULT_TIMEZONE,

  pagination: APP.PAGINATION,

  dateFormats: APP.DATE_FORMATS,
} as const;
