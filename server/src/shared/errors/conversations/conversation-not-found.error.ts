import { AppError } from "@/shared/errors/app-error";

export class ConversationNotFoundError extends AppError {
  constructor() {
    super("Conversation not found", 404, "CONVERSATION_NOT_FOUND");
  }
}