import { Message } from "@/modules/conversations/models/messages.model";
import { Conversation } from "@/modules/conversations/models/conversation.model";

import { ConversationNotFoundError } from "@/shared/errors/conversations/conversation-not-found.error";
import { UserNotInConversationError } from "@/shared/errors/conversations/not-in-conversation.error";

type getConversationInput = {
  conversationId: string,
  userId: string,
}

export async function getConversationService({
  conversationId,
  userId
}: getConversationInput ){
  const conversationExists = await Conversation.findById(conversationId);

  if (!conversationExists) {
    throw new ConversationNotFoundError();
  }

  if (!conversationExists.participants.includes(userId)) {
    throw new UserNotInConversationError();
  }

  const messages = await Message.find({
    conversation_id: conversationExists._id
  }).sort({ createdAt: -1 });

  // Mark messages as seen
  await Message.updateMany(
    { conversation_id: conversationExists._id }, 
    { seen: true }
  );

  return messages;
}