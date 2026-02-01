import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return reply.status(401).send({ success: false, message: 'Unauthorized' });
    }
  } catch (error) {
    request.log.error(error);

    return reply.status(401).send({ success: false, message: 'Invalid or expired authentication' });
  }
}