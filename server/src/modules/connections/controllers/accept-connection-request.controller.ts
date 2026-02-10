import { FastifyRequest, FastifyReply } from "fastify";
import { getAuth } from "@clerk/fastify";

import { acceptConnectionRequestParamsSchema } from "@/modules/connections/connections.schema";
import { acceptConnectionRequestService } from "@/modules/connections/services/accept-connection-request.service";

import { ZodError } from "zod";
import { ValidationError } from "@/shared/errors/validations/zod-validation.error";

export async function acceptConnectionRequestController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { userId } = getAuth(request);
    const { id } = acceptConnectionRequestParamsSchema.parse(request.params);

    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    await acceptConnectionRequestService({
      loggedUserId: userId,
      toConnectUserId: id
    });

    reply.status(200).send({
      success: true,
      message: "Connection accepted successfully"
    });

  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  }
}
