import fp from 'fastify-plugin'
import { getAuth } from "@clerk/fastify";

export const authPlugin = fp(async app => {
  app.decorateRequest("user", null);
  
  app.addHook('preHandler', async (request, reply) => {
    const { userId, getToken } = getAuth(request);
    const token = await getToken();

    if (!userId || !token) {
      return reply.status(401).send({ success: false, message: 'Unauthorized' });
    }
  
    try {
      request.user = { id: userId };
    } catch (error) {
      request.log.error(error);

      return reply.status(401).send({ success: false, message: 'Invalid or expired authentication' });
    }
  })
});
