import { inngest } from "@/jobs/client";
import { EVENTS } from "@/jobs/events";

import { ClerkUserUpdatedEventSchema } from "@/jobs/events/clerk/schemas/user-updated.schema";
import { mapClerkUserUpdatedtoDomain } from "@/jobs/events/clerk/user-updated.mapper";

import { updateUserDataService } from "@/modules/users/services/update-user-data.service";

export const clerkUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: EVENTS.USER_UPDATED },

  async ({ event }) => {
    const clerkData = ClerkUserUpdatedEventSchema.parse(event.data);

    const data = mapClerkUserUpdatedtoDomain(clerkData);

    await updateUserDataService(data);
  }
);