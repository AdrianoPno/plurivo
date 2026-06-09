import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Corrige o aviso de rotas tipadas
  typedRoutes: true,
  // Corrige o aviso de tracing no monorepo
  outputFileTracingRoot: path.join(__dirname, "../../../"),
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    config.resolve.alias["@shared"] = path.resolve(
      __dirname,
      "../../../shared",
    );
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
    };

    return config;
  },
};

export default nextConfig;
