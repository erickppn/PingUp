import Fastify from 'fastify';
import cors from '@fastify/cors'

// Plugins
import { clerkPlugin } from '@clerk/fastify'
import multipartPlugin from '@/plugins/multipart';
import { inngestPlugin } from '@/plugins/inngest';
import { errorHandler } from '@/plugins/errors';

// Routes
import { userRoutes } from '@/modules/users/users.routes';
import { postsRoutes } from '@/modules/posts/posts.routes';
import { storysRoutes } from '@/modules/storys/storys.routes';
import { conversationsRoutes } from '@/modules/conversations/conversations.routes';
import { realTimeRoute } from '@/shared/realtime/realtime-stream.route';

// Init the app
const app = Fastify({
  logger: true
});

//--------- Plugins ---------
// CORS
app.register(cors, {
  origin: process.env.FRONTEND_URL || '*'
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
app.register(postsRoutes, { prefix: '/posts' });
app.register(storysRoutes, { prefix: '/storys' });
app.register(conversationsRoutes, { prefix: '/conversations' });

// Real-time streaming route
app.register(realTimeRoute, { prefix: '/realtime' });

export default app;