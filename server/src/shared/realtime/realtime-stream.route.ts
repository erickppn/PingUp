import { FastifyInstance } from "fastify";
import { authPlugin } from "@/plugins/auth";

import { realtimeStreamController } from "./realtime-stream.controller";

export async function realTimeRoute(app: FastifyInstance) {
  app.register(authPlugin);
  app.get("/stream", realtimeStreamController);
}