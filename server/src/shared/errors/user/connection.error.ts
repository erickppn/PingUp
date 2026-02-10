import { AppError } from "@/shared/errors/app-error";

export class ConnectionRequestLimitError extends AppError {
  constructor() {
    super("You have sent more than 20 connection requests in the last 24 hours", 429, "TOO_MANY_REQUESTS");
  }
}

export class AlreadyConnectedError extends AppError {
  constructor() {
    super("You are already connected with this user", 409, "USERS_ALREADY_CONNECTED");
  }
}

export class ConnectionRequestPendingError extends AppError {
  constructor() {
    super("Connection request pending", 409, "CONNECTION_PENDING");
  }
}

export class ConnectionNotFoundError extends AppError {
  constructor() {
    super("This connection not exists", 404, "CONNECTION_NOT_FOUND");
  }
}