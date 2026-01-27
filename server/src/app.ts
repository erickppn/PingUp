import Fastify from 'fastify';
import { fastifyPlugin } from 'inngest/fastify';
import { clerkPlugin } from '@clerk/fastify'

import { inngest } from './inngest/client';
import { functions } from './inngest/functions';

// Init the app
const app = Fastify({
  logger: true
});

// Adds the auth Clerk Plugin
app.register(clerkPlugin)

app.get('/', (request, reply) => {
  reply.send('Server is running :)')
});

// Adds the "/api/inngest" routes to server
app.register(fastifyPlugin, {
  client: inngest,
  functions
});

export default app;