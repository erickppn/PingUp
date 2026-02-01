import Fastify from 'fastify';
import { fastifyPlugin } from 'inngest/fastify';

import { clerkPlugin } from '@clerk/fastify'
import cors from '@fastify/cors'
import multipartPlugin from './plugins/multipart';

import { inngest } from './inngest/client';
import { functions } from './inngest/functions';
import { requireAuth } from './hooks/require-auth';
import { userRoutes } from './routes/users.routes';

// Init the app
const app = Fastify({
  logger: true
});

//--------- Plugins ---------
// CORS
app.register(cors, {
  origin: '*'
});
// Adds the auth Clerk Plugin
app.register(clerkPlugin);
// Multipart
app.register(multipartPlugin);

//--------- Hooks ---------
app.addHook('preHandler', requireAuth);

//--------- Routes ---------
app.get('/', (request, reply) => {
  reply.send('Server is running :)')
});

app.register(userRoutes, { prefix: '/users' });

// Adds the "/api/inngest" routes to server
app.register(fastifyPlugin, {
  client: inngest,
  functions
});

export default app;