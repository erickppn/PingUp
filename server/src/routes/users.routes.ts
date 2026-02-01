import { FastifyInstance } from "fastify";
import { requireAuth } from "../hooks/require-auth";

import { discoverUsers, followUser, getUserData, unfollowUser, updateUserData } from "../controllers/users.controller";

export async function userRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth);

  app.get('/me', getUserData);
  app.patch('/me', updateUserData);
  app.get('/discover', discoverUsers);
  app.post('/:id/follow', followUser);
  app.delete('/:id/follow', unfollowUser);
}