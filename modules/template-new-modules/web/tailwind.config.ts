import type { Config } from "tailwindcss";
import sharedPreset from "@recicleiros/tailwind-config/preset"; // Caminho hipotético para o pacote

const config: Config = {
  presets: [sharedPreset],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/(auth)/**/*.{js,ts,jsx,tsx,mdx}", // Garanta que ele veja os Route Groups
  ],
};

export default config;
