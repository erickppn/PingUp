import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

import { sendMessageSchema } from "@/modules/conversations/conversations.schemas";
import { sendMessageService } from "@/modules/conversations/services/send-message.service";

import { parseMultipart } from "@/shared/http/parse-multpart";
import { cleanupTempFiles } from "@/shared/utils/cleanup-temp-files";
import { ValidationError } from "@/shared/errors/validations/zod-validation.error";

export async function sendMessageController(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.id;

  if (!userId) {
    return reply.status(401).send({ success: false, message: "Unauthorized" });
  }

  const { fields, files } = await parseMultipart(request, {
    maxFiles: {
      media: 1
    }
  });

  const media = files.media ? files.media[0] : null;

  try {
    const { receiver_id, text } = sendMessageSchema.parse(fields);

    const message = await sendMessageService({
      sender_id: userId,
      receiver_id,
      text,
      media
    });

    reply.code(201).send({ success: true, message });

  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  } finally {
    if (media) await cleanupTempFiles([media]);
  }
}