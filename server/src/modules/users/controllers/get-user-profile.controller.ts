import { FastifyRequest, FastifyReply } from "fastify";
import z, { ZodError } from "zod";

import { getUserProfileService } from "@/modules/users/services/get-user-profile.service";

import { ValidationError } from "@/shared/errors/validations/zod-validation.error";

export const getUserProfileparams = z.object({
  id: z.string()
});

export async function getUserProfileController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = getUserProfileparams.parse(request.params);

    const profile = await getUserProfileService(id);

    reply.status(200).send({
      success: true,
      profile
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  }
}