import { FastifyReply, FastifyRequest } from "fastify";

import { followUserParamsSchema } from "@/modules/users/users.schemas";
import { followUserService } from "@/modules/users/services/follow-user.service";

import { ZodError } from "zod";
import { ValidationError } from "@/shared/errors/validations/zod-validation.error";

export async function followUserController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = request.user?.id;
    const { id } = followUserParamsSchema.parse(request.params);

    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    await followUserService({
      loggedUserId: userId,
      toFollowUserId: id,
    });

    reply.status(200).send({
      success: true,
      message: "Now you are following this user"
    })
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  }
}