import { FastifyRequest, FastifyReply } from "fastify";

import { getUserDataService } from "@/modules/users/services/get-user-data.service";

import { ZodError } from "zod";
import { ValidationError } from "@/shared/errors/validations/zod-validation.error";

export async function getUserDataController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const user = await getUserDataService(userId);

    reply.status(200).send({ success: true, user });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  }
}