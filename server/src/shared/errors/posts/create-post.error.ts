import { AppError } from "@/shared/errors/app-error";

export class PostContentTooLongError extends AppError {
  constructor(maxLength: number) {
    super(`Post content exceeds ${maxLength} characters`, 400, "POST_CONTENT_TOO_LONG");
  }
}

export class TooManyImagesError extends AppError {
  constructor(max: number) {
    super(`You can upload at most ${max} images`, 400, "TOO_MANY_IMAGES");
  }
}
