import { getSseClient } from "./sse-manager";
import { SSEEvent } from "./sse-events";

export function emitMessageToUser(userId: string, event: SSEEvent, data: unknown) {
  const connections = getSseClient(userId);

  if (!connections) return;

  const message = `
    event: ${event}\n
    data: ${JSON.stringify(data)}\n\n
  `;
  
  for (const response of connections) {
    response.write(message);
  }
}