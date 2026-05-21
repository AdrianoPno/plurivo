import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Permite ao Next.js compilar nativamente arquivos TS fora do diretório web (como o /shared)
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    // 2. Mapeia o alias apenas para o shared externo encontrar os arquivos físicos
    config.resolve.alias["@shared"] = path.resolve(
      __dirname,
      "../../../shared",
    );

    // 3. Aplica o mapeamento de extensão .js apenas para o escopo do shared
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
    };

    return config;
  },
};

export default nextConfig;
