import { AppError } from "../../../../../shared/utils/app-error.js";

export class ValidationError extends AppError {
  public errors: any;
  name: string;

  constructor(message: string, errors: any) {
    super(message, 400);
    this.name = "ValidationError";
    this.errors = errors;
  }
}
