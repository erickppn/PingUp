import { FastifyInstance } from "fastify";
import { getUserData, updateUserData } from "../controllers/users.controller";

export async function userRoutes(app: FastifyInstance) {
  app.get('/', getUserData);
  app.put('/', updateUserData);
}