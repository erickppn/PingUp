import { inngest } from "../client";
import { EVENTS } from "../events";

import { ClerkUserCreatedEventSchema } from "../events/clerk/schemas/user-created.schema";
import { mapClerkUserCreatedtoDomain } from "../events/clerk/user-created.mapper";

import { createUser } from "../../modules/users/users.controller";

export const clerkUserCreation = inngest.createFunction(
  { id: 'create-user-from-clerk' },
  { event: EVENTS.USER_CREATED },

  async ({ event }) => {
    const clerkData = ClerkUserCreatedEventSchema.parse(event.data);

    const data = mapClerkUserCreatedtoDomain(clerkData);

    await createUser(data);
  }
);