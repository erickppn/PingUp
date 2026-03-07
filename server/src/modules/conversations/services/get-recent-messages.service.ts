import { Conversation } from "@/modules/conversations/models/conversation.model";

export async function getRecentMessagesService(userId: string) {
  return await Conversation.find({
    participants: userId
  }).sort({ updatedAt: -1 }).populate("participants").populate("last_message");
}