import { User } from "@/modules/users/users.model";
import { Conversation } from "@/modules/conversations/models/conversation.model";

import { buildURL, uploadToImageKit } from "@/shared/providers/media/imagekit/imagekit.provider";

import { FileData } from "@/shared/providers/media/media.provider"
import { sendMessageInput } from "@/modules/conversations/conversations.schemas"

import { UserNotFoundError } from "@/shared/errors/user/not-found.error";
import { CannotMessageYourselfError } from "@/shared/errors/conversations/send-message.error";

import { emitMessageToUser } from "@/shared/realtime/sse/sse-emitters";

import { Message } from "../models/messages.model";
import { randomUUID } from "node:crypto";

type sendMessageData = sendMessageInput & {
  sender_id: string,
  media: FileData | null
}

export async function sendMessageService({
  sender_id,
  receiver_id,
  text,
  media
}: sendMessageData) {
  const senderUser = await User.findById(sender_id);

  if (!senderUser) {
    throw new UserNotFoundError();
  }

  // Prevent users from sending messages to themselves
  if (sender_id === receiver_id) {
    throw new CannotMessageYourselfError();
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [sender_id, receiver_id] }
  });

  if (!conversation) {
    conversation = await Conversation.create({
      _id: randomUUID(),
      participants: [sender_id, receiver_id]
    });
  }

  // Upload media to ImageKit if it's a media message and get the URL
  let media_url = "";
  const message_type = media ? "media" : "text";

  if (message_type === "media" && media) {
    const uploadedMedia = await uploadToImageKit(media);

    media_url = buildURL(uploadedMedia.url, {
      transformation: [
        { quality: 100 },
        { format: 'webp' },
        { width: '1280' }
      ]
    });
  }

  const message = await Message.create({
    _id: randomUUID(),
    conversation_id: conversation._id,
    sender_id: senderUser.id,
    text,
    message_type,
    media_url
  });

  // Update the conversation's last message
  conversation.last_message = message._id;
  await conversation.save();

  // Send the message to the recipient in real-time using SSE
  const messageWithUserData = await Message.findById(message._id).populate('sender_id');

  emitMessageToUser(receiver_id, "message.created", messageWithUserData);

  return message;
}