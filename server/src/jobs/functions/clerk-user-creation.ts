import { inngest } from "@/jobs/client"; 
import { EVENTS } from "@/jobs/events";

import { ClerkUserCreatedEventSchema } from "@/jobs/events/clerk/schemas/user-created.schema";
import { mapClerkUserCreatedtoDomain } from "@/jobs/events/clerk/user-created.mapper";

import { createUserService } from "@/modules/users/services/create-user.service";

export const clerkUserCreation = inngest.createFunction(
  { id: 'create-user-from-clerk' },
  { event: EVENTS.USER_CREATED },

  async ({ event }) => {
    const clerkData = ClerkUserCreatedEventSchema.parse(event.data);

    const data = mapClerkUserCreatedtoDomain(clerkData);

    await createUserService(data);
  }
);