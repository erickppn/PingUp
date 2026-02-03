import { ClerkUserCreatedEventData } from "./clerk/schemas/user-created.schema"
import { ClerkUserDeletedEventData } from "./clerk/schemas/user-deleted.schema"
import { ClerkUserUpdatedEventData } from "./clerk/schemas/user-updated.schema"

export const EVENTS = {
  USER_CREATED: "clerk/user.created",
  USER_UPDATED: "clerk/user.updated",
  USER_DELETED: "clerk/user.deleted",
} as const

export type EventsSchema = {
  [EVENTS.USER_CREATED]: {
    data: ClerkUserCreatedEventData
  },

  [EVENTS.USER_UPDATED]: {
    data: ClerkUserUpdatedEventData
  },

  [EVENTS.USER_DELETED]: {
    data: ClerkUserDeletedEventData
  }
}
