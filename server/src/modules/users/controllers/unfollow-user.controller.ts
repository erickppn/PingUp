import { FastifyRequest, FastifyReply } from "fastify";

import { unfollowUserParamsSchema } from "@/modules/users/users.schemas";
import { unfollowUserService } from "@/modules/users/services/unfollow-user.service";

import { ZodError } from "zod";
import { ValidationError } from "@/shared/errors/validations/zod-validation.error";

export async function unfollowUserController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = request.user?.id;
    const { id } = unfollowUserParamsSchema.parse(request.params);

    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    await unfollowUserService({
      loggedUserId: userId,
      toUnfollowUserId: id
    });

    reply.status(200).send({
      success: true,
      message: "You are no longer following this user"
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  }
}