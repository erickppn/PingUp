import { inngest } from "../client";
import { EVENTS } from "../events";

import { ClerkUserUpdatedEventSchema } from "../events/clerk/schemas/user-updated.schema";
import { mapClerkUserUpdatedtoDomain } from "../events/clerk/user-updated.mapper";

import { updateUserData } from "../../modules/users/users.controller";

export const clerkUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: EVENTS.USER_UPDATED },

  async ({ event }) => {
    const clerkData = ClerkUserUpdatedEventSchema.parse(event.data);

    const data = mapClerkUserUpdatedtoDomain(clerkData);

    await updateUserData(data);
  }
);