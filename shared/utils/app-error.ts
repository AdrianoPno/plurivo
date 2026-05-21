export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";

    // Garante que o instanceof funcione corretamente em TypeScript
    Object.setPrototypeOf(this, AppError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}
