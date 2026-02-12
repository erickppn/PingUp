import { FastifyReply, FastifyRequest } from "fastify";
import z, { success, ZodError } from "zod";

import { toggleLikeService } from "@/modules/posts/services/toggle-like.service";

import { ValidationError } from "@/shared/errors/validations/zod-validation.error";

export async function toggleLikeController(request: FastifyRequest, reply: FastifyReply) {
  const toggleLikeParams = z.object({
    id: z.string()
  });

  try {
    const userId = request.user?.id;
    const { id: postId } = toggleLikeParams.parse(request.params);

    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const result = await toggleLikeService({
      loggedUserId: userId,
      postId
    });

    reply.status(200).send({
      success: true,
      message: `Post ${result.liked ? "liked" : "unliked"}`,
      likesCount: result.likesCount
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  }
}