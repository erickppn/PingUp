import { AppError } from "@/shared/errors/app-error";

export class AlreadyFollowingUserError extends AppError {
  constructor() {
    super("You are already following this user", 409, "ALREADY_FOLLOWING_USER");
  }
}

export class CannotFollowYourselfError extends AppError {
  constructor() {
    super("You cannot follow yourself", 400, "CANNOT_FOLLOW_YOURSELF");
  }
}