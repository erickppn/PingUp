import fp from 'fastify-plugin';
import { fastifyPlugin } from "inngest/fastify";

import { inngest } from '@/jobs//client';
import { functions } from '@/jobs/functions';

export const inngestPlugin = fp(async app => {
  app.register(fastifyPlugin, {
    client: inngest,
    functions,
    options: {},
  });
});