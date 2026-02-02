import { FastifyInstance } from "fastify";
import { requireAuth } from "../hooks/require-auth";

import {
  discoverUsers,
  followUser, 
  getUserConnections, 
  getUserData, 
  sendConnectionRequest, 
  unfollowUser, 
  updateUserData,
  acepptConnectionRequest
} from "../controllers/users.controller";

export async function userRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth);

  app.get('/me', getUserData);
  app.get('/me/connections', getUserConnections);
  app.patch('/me', updateUserData);
  app.get('/discover', discoverUsers);
  app.post('/:id/follow', followUser);
  app.delete('/:id/follow', unfollowUser);
  app.post('/:id/request-connection', sendConnectionRequest);
  app.patch('/:id/accept-connection', acepptConnectionRequest);
}