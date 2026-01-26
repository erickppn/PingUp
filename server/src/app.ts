import Fastify from 'fastify';
import { fastifyPlugin } from 'inngest/fastify';
import { inngest } from './inngest/client';

const app = Fastify({
  logger: true
});

app.get('/', (request, reply) => {
  reply.send('Server is running :)')
});

app.register(fastifyPlugin, {
  client: inngest,
  functions: []
});

export default app;