import { FastifyRequest, FastifyReply } from "fastify";
import { getUserDataService } from "@/modules/users/services/get-user-data.service";

export async function getUserDataController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = request.user?.id;

    const user = await getUserDataService(userId);

    reply.status(200).send({ success: true, user });
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      reply.status(401).send({ success: false, message: error.message });
    }

    throw error;
  }
}