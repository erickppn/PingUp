import { FastifyReply, FastifyRequest } from "fastify";
import { getRecentMessagesService } from "@/modules/conversations/services/get-recent-messages.service";

export async function getRecentMessagesController(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.id;

  if (!userId) {
    return reply.status(401).send({ success: false, message: "Unauthorized" });
  }

  const messages = await getRecentMessagesService(userId);

  return reply.send({ success: true, messages });
}