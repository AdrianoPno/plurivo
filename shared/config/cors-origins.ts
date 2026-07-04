import { MODULE_URLS } from "../constants/modules";

export function getAllowedOrigins(): string[] {
  const configuredOrigins = process.env.CORS_ORIGINS
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configuredOrigins?.length) return configuredOrigins;

  return [
    MODULE_URLS.platformShell.web,
    MODULE_URLS.voxObservatory.web,
    MODULE_URLS.coopManager.web,
  ];
}
