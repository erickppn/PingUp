import z from "zod";

export const sendMessageSchema = z.object({
  receiver_id: z.string(),
  text: z.string()
});

export type sendMessageInput = z.infer<typeof sendMessageSchema>;

export const getConversationSchema = z.object({
  conversation_id: z.string(),
});
