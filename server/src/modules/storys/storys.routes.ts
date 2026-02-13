import { FastifyInstance } from "fastify";
import { authPlugin } from "@/plugins/auth";
import { addStoryController } from "@/modules/storys/controllers/add-story.controller";
import { getStorysController } from "@/modules/storys/controllers/get-storys.controller";


export async function storysRoutes(app: FastifyInstance) {
  app.register(authPlugin);

  app.post('/', addStoryController);
  app.get('/', getStorysController);
}