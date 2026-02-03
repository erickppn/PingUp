import fp, { fastifyPlugin } from 'fastify-plugin';
import { inngest } from '../inngest/client';
import { functions } from '../inngest/functions';
import { serve } from 'inngest/fastify';

export const inngestPlugin = fp(async app => {
  app.route({
    method: ["GET", "POST"],
    url: '/api/inngest',
    handler: serve({
      client: inngest,
      functions
    }),
  });
});