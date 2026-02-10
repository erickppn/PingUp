import { AppError } from "@/shared/errors/app-error";

export class ImageUploadError extends AppError {
  constructor(context: string) {
    super(`Failed to upload image for ${context}`, 502, "UPLOAD_FAILED");
  }
}