import { inngest } from "../client";
import { EVENTS } from "../events";

import { User } from "../../models/User";

export const clerkUserCreation = inngest.createFunction(
  { id: 'create-user-from-clerk' },
  { event: EVENTS.USER_CREATED },

  async ({ event }) => {
    const { id, email_addresses, first_name, last_name, image_url } = event.data;
    
    let username = email_addresses[0].email_address.split('@')[0];

    //Check availability of username
    const user = await User.findOne({username});

    if (user) {
      username = username + Math.floor(Math.random() * 1000);
    }

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      full_name: first_name + " " + last_name,
      profile_picture: image_url,
      username
    }

    await User.findOneAndUpdate({
     _id: id, 
    }, userData, {
      upsert: true, 
      new: true 
    });
  }
);