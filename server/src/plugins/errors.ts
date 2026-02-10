import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

import { AppError } from "@/shared/errors/app-error";
import { ValidationError } from "@/shared/errors/validations/zod-validation.error";

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  request.log.error({
    event: "request.failed",
    error,
    requestId: request.id
  });

  if (error instanceof ValidationError) {
    return reply.status(error.statusCode).send({
      success: false,
      code: error.code,
      fields: error.fields,
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      code: error.code,
      message: error.message
    });
  }

  return reply.status(500).send({
    success: false,
    code: "INTERNAL_ERROR",
    message: "Unexpected error",
  });
}