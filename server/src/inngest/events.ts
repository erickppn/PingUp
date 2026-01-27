export const EVENTS = {
  USER_CREATED: "clerk/user.created",
  USER_UPDATED: "clerk/user.updated",
  USER_DELETED: "clerk/user.deleted",
} as const

export type EventsSchema = {
  [EVENTS.USER_CREATED]: {
    data: {
      id: string,
      first_name: string,
      last_name: string,
      email_addresses: [{ email_address: string }],
      image_url: string
    }
  },
  [EVENTS.USER_UPDATED]: {
    data: {
      id: string,
      first_name: string,
      last_name: string,
      email_addresses: [{ email_address: string }],
      image_url: string
    }
  },
  [EVENTS.USER_DELETED]: {
    data: {
      id: string,
    }
  }
}
