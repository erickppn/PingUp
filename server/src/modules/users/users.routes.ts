import { FastifyInstance } from "fastify";
import { authPlugin } from "@/plugins/auth";
;
import * as ConnectionsController from "@/modules/connections/connections.controller";

import { getUserDataController } from "@/modules/users/controllers/get-user-data.controller";
import { discoverUsersController } from "@/modules/users/controllers/discover-users.controller";
import { followUserController } from "@/modules/users/controllers/follow-user.controller";
import { unfollowUserController } from "@/modules/users/controllers/unfollow-user.controller";
import { updateUserProfileController } from "@/modules/users/controllers/update-user-profile.controller";

export async function userRoutes(app: FastifyInstance) {
  app.register(authPlugin);

  app.get('/me', getUserDataController);
  app.get('/me/connections', ConnectionsController.getUserConnections);
  app.patch('/me', updateUserProfileController);
  app.get('/discover', discoverUsersController);
  app.post('/:id/follow', followUserController);
  app.delete('/:id/follow', unfollowUserController);
  app.post('/:id/request-connection', ConnectionsController.sendConnectionRequest);
  app.patch('/:id/accept-connection', ConnectionsController.acepptConnectionRequest);
}