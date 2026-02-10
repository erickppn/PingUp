import { AppError } from "@/shared/errors/app-error";

export class UserNotFoundError extends AppError {
  constructor() {
    super("This user not exists", 404, "USER_NOT_FOUND");
  }
}

export class TargetUserNotFoundError extends AppError {
  constructor(action: 'follow' | 'unfollow' | 'connect') {
    super(`The user you are trying to ${action} does not exist`, 404, "USER_NOT_FOUND");
  }
}