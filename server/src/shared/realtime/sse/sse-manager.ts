import type { ServerResponse } from "node:http";

const sseClients = new Map<string, Set<ServerResponse>>();

export function registerSseClient(userId: string, response: ServerResponse) {
  let connections = sseClients.get(userId);

  if (!connections) {
    connections = new Set();
    sseClients.set(userId, connections);
  }

  connections.add(response);
}

export function unregisterSseClient(userId: string, response: ServerResponse) {
  const connections = sseClients.get(userId);

  if (!connections) return;

  connections.delete(response);

  if (connections.size === 0) {
    sseClients.delete(userId);
  }
}

export function getSseClient(userId: string) {
  return sseClients.get(userId);
}