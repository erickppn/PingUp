import { FastifyReply, FastifyRequest } from "fastify";

import { followUserParamsSchema } from "@/modules/users/users.schemas";
import { followUserService } from "@/modules/users/services/follow-user.service";

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
      success: false,
      message: "Now you are following this user"
    })
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      reply.status(401).send({
        success: false,
        message: error.message
      });
    }

    throw error;
  }
}