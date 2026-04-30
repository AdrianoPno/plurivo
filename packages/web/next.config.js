/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    // Adicionado para resolver o aviso de múltiplos lockfiles no monorepo.
    // Isso informa ao Turbopack para considerar o diretório atual como a raiz do projeto.
    turbopack: {
      root: __dirname,
    },
  },
};

module.exports = nextConfig;
