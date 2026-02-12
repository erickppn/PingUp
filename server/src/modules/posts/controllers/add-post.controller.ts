import { FastifyReply, FastifyRequest } from "fastify";

import { parseMultipart } from "@/shared/http/parse-multpart";
import { addPostInputSchema } from "@/modules/posts/posts.schemas";
import { ZodError } from "zod";

import { ValidationError } from "@/shared/errors/validations/zod-validation.error";

import { addPostService } from "../services/add-post.service";
import { cleanupTempFiles } from "@/shared/utils/cleanup-temp-files";

export async function addPostController(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.id;
  const { fields, files } = await parseMultipart(request, {
    maxFiles: {
      images: 4
    }
  });

  const images = files.images || [];

  try {
    const { content, post_type } = addPostInputSchema.parse(fields);

    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    await addPostService({
      loggedUserId: userId,
      content,
      images,
      post_type
    });

    reply.status(200).send({
      success: true,
      message: "Post created successfully"
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  } finally {
    await cleanupTempFiles(images);
  }
}