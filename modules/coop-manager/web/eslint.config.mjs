import eslintConfigNext from "eslint-config-next";

export default {
  ...eslintConfigNext,
  rules: {
    ...eslintConfigNext.rules,
    "@next/next/no-img-element": "off",
  },
};
