import { FastifyInstance } from "fastify";
import { authPlugin } from "@/plugins/auth";

import { getConversationController } from "@/modules/conversations/controllers/get-conversation.controller";
import { sendMessageController } from "@/modules/conversations/controllers/send-message.controller";
import { getRecentMessagesController } from "@/modules/conversations/controllers/get-recent-messages.controller";

export async function conversationsRoutes(app: FastifyInstance) {
  app.register(authPlugin);

  app.get("/:conversation_id/messages", getConversationController);
  app.get('/recent-messages', getRecentMessagesController);
  app.post("/messages", sendMessageController);
}