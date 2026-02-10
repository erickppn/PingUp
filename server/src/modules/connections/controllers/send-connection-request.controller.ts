import { FastifyReply, FastifyRequest } from "fastify";

import { connectionRequestParamsSchema } from "@/modules/connections/connections.schema";
import { createConnectionRequestService } from "@/modules/connections/services/create-connetion-request.service";

import { ZodError } from "zod";
import { ValidationError } from "@/shared/errors/validations/zod-validation.error";

export async function createConnectionRequestController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = request.user?.id;
    const { id } = connectionRequestParamsSchema.parse(request.params);

    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    await createConnectionRequestService({
      loggedUserId: userId,
      toConnectUserId: id
    });

    reply.status(201).send({
      success: true,
      message: "Connection request sent successfully"
    });

  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  }
}