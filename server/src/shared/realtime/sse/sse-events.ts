const SSE_EVENTS = {
  MESSAGE_CREATED: "message.created",
  MESSAGE_READ: "message.read",
  NOTIFICATION_CREATED: "notification.created",
  USER_ONLINE: "user.online",
  USER_OFFLINE: "user.offline"
} as const;

export type SSEEvent = typeof SSE_EVENTS[keyof typeof SSE_EVENTS];