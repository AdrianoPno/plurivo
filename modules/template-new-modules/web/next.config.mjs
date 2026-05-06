import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Resolve o caminho absoluto para a raiz do monorepo
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
};

export default nextConfig;
