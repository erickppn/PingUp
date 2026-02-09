import { FastifyReply, FastifyRequest } from "fastify";

import { searchUsersQuerySchema } from "@/modules/users/users.schemas";
import { discoverUsersQuery } from "@/modules/users/queries/discover-users.query";

// Find users by username, email, location, name
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
    console.log(error);

    if (error instanceof Error) {
      reply.status(401).send({ success: false, message: error.message });
    }
    
    throw error;
  }
}