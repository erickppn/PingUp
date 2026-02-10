import { AppError } from "@/shared/errors/app-error";

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super("User already exists", 409, "USER_ALREADY_EXISTS");
  }
}
