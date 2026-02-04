import { inngest } from "@/jobs/client";
import { EVENTS } from "@/jobs/events";

import { ClerkUserDeletedEventSchema } from "@/jobs/events/clerk/schemas/user-deleted.schema";

import { deleteUser } from "@/modules/users/users.controller";

export const clerkUserDeletion = inngest.createFunction(
  { id: 'delete-user-from-clerk' },
  { event: EVENTS.USER_DELETED },

  async ({ event }) => {
    const { id } = ClerkUserDeletedEventSchema.parse(event.data);

    await deleteUser(id);
  }
);