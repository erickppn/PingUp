import { deleteUser } from "../../modules/users/users.controller";
import { inngest } from "../client";
import { EVENTS } from "../events";
import { ClerkUserDeletedEventSchema } from "../events/clerk/schemas/user-deleted.schema";

export const clerkUserDeletion = inngest.createFunction(
  { id: 'delete-user-from-clerk' },
  { event: EVENTS.USER_DELETED },

  async ({ event }) => {
    const { id } = ClerkUserDeletedEventSchema.parse(event.data);

    await deleteUser(id);
  }
);