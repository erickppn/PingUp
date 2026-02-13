import { FastifyRequest, FastifyReply } from "fastify";
import { ZodError } from "zod";

import { parseMultipart } from "@/shared/http/parse-multpart";
import { addStoryInputSchema } from "@/modules/storys/story.schemas";

import { addStoryService } from "@/modules/storys/services/add-story.service";

import { ValidationError } from "@/shared/errors/validations/zod-validation.error";
import { cleanupTempFiles } from "@/shared/utils/cleanup-temp-files";

export async function addStoryController(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.id;
  const { fields, files } = await parseMultipart(request, {
    maxFiles: {
      media: 1
    }
  });

  const media = files.media ? files.media[0] : null;

  try {
    const { content, background_color, media_type } = addStoryInputSchema.parse(fields);

    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    await addStoryService({
      loggedUserId: userId,
      content,
      background_color,
      media,
      media_type
    });

    reply.status(200).send({
      success: true,
      message: "Story created successfully"
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  } finally {
    if (media) await cleanupTempFiles([media]);
  }
}