import { FastifyReply, FastifyRequest } from "fastify";

import { searchUsersQuerySchema } from "@/modules/users/users.schemas";
import { discoverUsersQuery } from "@/modules/users/queries/discover-users.query";

import { ZodError } from "zod";
import { ValidationError } from "@/shared/errors/validations/zod-validation.error";

export async function discoverUsersController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = request.user?.id;
    const { search_query } = searchUsersQuerySchema.parse(request.query);

    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const users = await discoverUsersQuery({
      query: search_query,
      excluideUserId: userId
    });

    reply.status(200).send({
      success: true,
      users
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  }
}