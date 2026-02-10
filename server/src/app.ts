import Fastify from 'fastify';
import cors from '@fastify/cors'

// Plugins
import { clerkPlugin } from '@clerk/fastify'
import multipartPlugin from '@/plugins/multipart';
import { inngestPlugin } from '@/plugins/inngest';
import { errorHandler } from '@/plugins/errors';

// Routes
import { userRoutes } from '@/modules/users/users.routes';

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
// Inngest
app.register(inngestPlugin);

// Error Handling
app.setErrorHandler(errorHandler);

//--------- Routes ---------
app.get('/', (request, reply) => {
  reply.send('Server is running :)')
});

app.register(userRoutes, { prefix: '/users' });

export default app;