import { FastifyRequest, FastifyReply } from "fastify";
import { getAuth } from "@clerk/fastify";

import { acceptConnectionRequestParamsSchema } from "@/modules/connections/connections.schema";
import { acceptConnectionRequestService } from "@/modules/connections/services/accept-connection-request.service";

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
    console.log(error);

    if (error instanceof Error) {
      reply.status(401).send({ success: false, message: error.message });
    }
    
    throw error;
  }
}
