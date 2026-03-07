import { FastifyRequest, FastifyReply } from "fastify";

import { getStorysService } from "@/modules/storys/services/get-storys.service";

export async function getStorysController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const storys = await getStorysService(userId);

    reply.status(200).send({
      success: true,
      storys
    });
  } catch (error) {
    throw error;
  }
}