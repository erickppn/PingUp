import { FastifyReply, FastifyRequest } from "fastify";

import { registerSseClient, unregisterSseClient } from "./sse/sse-manager";

export function realtimeStreamController(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.id;

  if (!userId) {
    return reply.status(401).send({ success: false, message: "Unauthorized" });
  }

  // Set headers for Server-Sent Events (SSE)
  reply.raw.setHeader('Content-Type', 'text/event-stream');
  reply.raw.setHeader('Cache-Control', 'no-cache');
  reply.raw.setHeader('Connection', 'keep-alive');
  reply.raw.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');

  reply.raw.flushHeaders();

  // Register the client for SSE
  registerSseClient(userId, reply.raw);
  reply.raw.write(`data: connected\n\n`);

  request.raw.on('close', () => {
    // Unregister the client when the connection is closed
    unregisterSseClient(userId, reply.raw);
  });
}