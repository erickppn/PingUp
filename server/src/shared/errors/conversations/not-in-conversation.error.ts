import { AppError } from "@/shared/errors/app-error";

export class UserNotInConversationError  extends AppError {
  constructor() {
    super("Not allowed", 403, "NOT_ALLOWED");
  }
}