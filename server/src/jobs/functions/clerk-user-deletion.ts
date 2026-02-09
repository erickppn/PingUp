import { inngest } from "@/jobs/client";
import { EVENTS } from "@/jobs/events";

import { ClerkUserDeletedEventSchema } from "@/jobs/events/clerk/schemas/user-deleted.schema";

import { deleteUserService } from "@/modules/users/services/delete-user.service";

export const clerkUserDeletion = inngest.createFunction(
  { id: 'delete-user-from-clerk' },
  { event: EVENTS.USER_DELETED },

  async ({ event }) => {
    const { id } = ClerkUserDeletedEventSchema.parse(event.data);

    await deleteUserService(id);
  }
);