import { ZodError } from "zod";
import { AppError } from "@/shared/errors/app-error";

type FieldError = {
  message: string,
  field: string
}

export class ValidationError extends AppError {
  public fields: FieldError[];

  constructor(error: ZodError) {
    super(error.message, 400, 'INVALID_INPUT');

    this.fields = error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
  }
}