import { FastifyInstance } from "fastify";
import { authPlugin } from "@/plugins/auth";

import * as UsersController from "@/modules/users/users.controller";
import * as ConnectionsController from "@/modules/connections/connections.controller";

export async function userRoutes(app: FastifyInstance) {
  app.register(authPlugin);

  app.get('/me', UsersController.getUserData);
  app.get('/me/connections', ConnectionsController.getUserConnections);
  app.patch('/me', UsersController.updateUserProfile);
  app.get('/discover', UsersController.discoverUsers);
  app.post('/:id/follow', UsersController.followUser);
  app.delete('/:id/follow', UsersController.unfollowUser);
  app.post('/:id/request-connection', ConnectionsController.sendConnectionRequest);
  app.patch('/:id/accept-connection', ConnectionsController.acepptConnectionRequest);
}