import fp from 'fastify-plugin';
import { serve } from 'inngest/fastify';

import { inngest } from '@/jobs//client';
import { functions } from '@/jobs/functions';

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