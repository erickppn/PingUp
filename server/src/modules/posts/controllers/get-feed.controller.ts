import { FastifyReply, FastifyRequest } from "fastify";

import { getFeedService } from "@/modules/posts/services/get-feed.service";

export async function getFeedController(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.id;

  if (!userId) {
    return reply.status(401).send({ success: false, message: "Unauthorized" });
  }

  const feed = await getFeedService(userId);

  reply.status(200).send({
    success: true,
    feed
  });
}