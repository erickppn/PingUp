import { User } from "../../modules/users/users.model";
import { inngest } from "../client";
import { EVENTS } from "../events";

export const clerkUserDeletion = inngest.createFunction(
  { id: 'delete-user-from-clerk' },
  { event: EVENTS.USER_DELETED },

  async ({ event }) => {
    const { id } = event.data;

    await User.findOneAndDelete({
     _id: id, 
    });
  }
);