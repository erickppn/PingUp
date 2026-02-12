import { AppError } from "@/shared/errors/app-error";

export class PostNotFoundError extends AppError {
  constructor() {
    super("Post not found", 404, "POST_NOT_FOUND");
  }
}