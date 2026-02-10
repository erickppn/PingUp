import { FastifyReply, FastifyRequest } from "fastify";
import { getMyConnectionsService } from "@/modules/connections/services/get-my-connections.service";

export async function getMyConnectionsController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { connections, followers, following, pendingConnections } = await getMyConnectionsService(userId);

    reply.status(200).send({
      success: true,
      connections,
      followers,
      following,
      pendingConnections
    });

  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      reply.status(401).send({ success: false, message: error.message });
    }

    throw error;
  }
}