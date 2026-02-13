import { AppError } from "@/shared/errors/app-error";

export class StoryNotFoundError extends AppError {
  constructor() {
    super("Story not found", 404, "STORY_NOT_FOUND");
  }
}