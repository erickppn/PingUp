import { FastifyInstance } from "fastify";
import { authPlugin } from "@/plugins/auth";

import { getUserDataController } from "@/modules/users/controllers/get-user-data.controller";
import { discoverUsersController } from "@/modules/users/controllers/discover-users.controller";
import { followUserController } from "@/modules/users/controllers/follow-user.controller";
import { unfollowUserController } from "@/modules/users/controllers/unfollow-user.controller";
import { updateUserProfileController } from "@/modules/users/controllers/update-user-profile.controller";

import { createConnectionRequestController } from "@/modules/connections/controllers/send-connection-request.controller";
import { getMyConnectionsController } from "@/modules/connections/controllers/get-my-connections.controller";
import { acceptConnectionRequestController } from "@/modules/connections/controllers/accept-connection-request.controller";

export async function userRoutes(app: FastifyInstance) {
  app.register(authPlugin);

  app.get('/me', getUserDataController);
  app.get('/me/connections', getMyConnectionsController);
  app.patch('/me', updateUserProfileController);
  app.get('/discover', discoverUsersController);
  app.post('/:id/follow', followUserController);
  app.delete('/:id/follow', unfollowUserController);
  app.post('/:id/request-connection', createConnectionRequestController);
  app.patch('/:id/accept-connection', acceptConnectionRequestController);
}