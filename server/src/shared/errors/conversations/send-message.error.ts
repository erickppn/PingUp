import { AppError } from "@/shared/errors/app-error";

export class CannotMessageYourselfError extends AppError {
  constructor() {
    super("Cannot message yourself", 400, "CANNOT_MESSAGE_YOURSELF");
  }
}