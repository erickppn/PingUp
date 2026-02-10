import { FastifyRequest, FastifyReply } from "fastify";

import { parseMultipart } from "@/shared/http/parse-multpart";

import { updateProfileInputSchema } from "@/modules/users/users.schemas";
import { updateUserProfileService } from "@/modules/users/services/update-user-profile.service";

import { ZodError } from "zod";
import { ValidationError } from "@/shared/errors/validations/zod-validation.error";

export async function updateUserProfileController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = request.user?.id;
    const { fields, files } = await parseMultipart(request);

    const { username, full_name, bio, location } = updateProfileInputSchema.parse(fields);

    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const user = await updateUserProfileService({
      userId,
      username,
      full_name,
      bio,
      location,
      profileImage: files.profile?.[0],
      coverImage: files.cover?.[0],
    });

    reply.status(200).send({ success: true, user, message: "Profile updated successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  }
}
