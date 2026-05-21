export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["**/?(*.)+(spec|test).{ts,tsx,js}"],
};
