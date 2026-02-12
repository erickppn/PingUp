import { FastifyInstance } from "fastify";
import { authPlugin } from "@/plugins/auth";

import { addPostController } from "@/modules/posts/controllers/add-post.controller";
import { getFeedController } from "@/modules/posts/controllers/get-feed.controller";
import { toggleLikeController } from "@/modules/posts/controllers/toggle-like.controller";

export async function postsRoutes(app: FastifyInstance) {
  app.register(authPlugin);

  app.post('/', addPostController);
  app.get('/feed', getFeedController);
  app.post('/:id/like', toggleLikeController);
}