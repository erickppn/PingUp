import { FastifyReply, FastifyRequest } from "fastify";

import { getConversationSchema } from "@/modules/conversations/conversations.schemas";
import { getConversationService } from "@/modules/conversations/services/get-conversation.service";

export async function getConversationController(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.id;

  if (!userId) {
    return reply.status(401).send({ success: false, message: "Unauthorized" });
  }

  const { conversation_id } = getConversationSchema.parse(request.params);

  const messages = await getConversationService({
    conversationId: conversation_id,
    userId
  });

  reply.send({ success: true, messages });
}