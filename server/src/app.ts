import Fastify from 'fastify';
import { fastifyPlugin } from 'inngest/fastify';

import { inngest } from './inngest/client';
import { functions } from './inngest/functions';

// Init the app
const app = Fastify({
  logger: true
});

app.get('/', (request, reply) => {
  reply.send('Server is running :)')
});

// Adds the "/api/inngest" routes to server
app.register(fastifyPlugin, {
  client: inngest,
  functions
});

export default app;