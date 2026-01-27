import { inngest } from "../client";
import { EVENTS } from "../events";

import { User } from "../../models/User";

export const clerkUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: EVENTS.USER_UPDATED },

  async ({ event }) => {
    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const updatedUserData = {
      _id: id,
      email: email_addresses[0].email_address,
      full_name: first_name + " " + last_name,
      profile_picture: image_url,
    }

    await User.findOneAndUpdate({
     _id: id, 
    }, updatedUserData);
  }
);