import { ClerkUserCreatedEventData } from "@/jobs/events/clerk/schemas/user-created.schema"
import { ClerkUserDeletedEventData } from "@/jobs/events/clerk/schemas/user-deleted.schema"
import { ClerkUserUpdatedEventData } from "@/jobs/events/clerk/schemas/user-updated.schema"

export const EVENTS = {
  USER_CREATED: "clerk/user.created",
  USER_UPDATED: "clerk/user.updated",
  USER_DELETED: "clerk/user.deleted",
  CONNECTION_REQUESTED: "connection/requested",
  CONNECTION_ACEPPTED: "connection/accepted",
  STORY_CREATED: "story/created"
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
  },

  [EVENTS.CONNECTION_REQUESTED]: {
    data: {
      connectionId: string
    }
  },

  [EVENTS.CONNECTION_ACEPPTED]: {
    data: {
      connectionId: string
    }
  },

  [EVENTS.STORY_CREATED]: {
    data: {
      storyId: string
    }
  }
}
