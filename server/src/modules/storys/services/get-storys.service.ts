import { User } from "@/modules/users/users.model";

import { UserNotFoundError } from "@/shared/errors/user/not-found.error";
import { Story } from "@/modules/storys/story.model";

export async function getStorysService(loggedUserId: string) {
  const loggedUser = await User.findById(loggedUserId);

  if (!loggedUser) {
    throw new UserNotFoundError();
  }

  const userIds = [loggedUser._id, ...loggedUser.connections, ...loggedUser.following];

  const stories = await Story.find({
    user: {
      $in: userIds
    }
  }).populate("user").sort({ createdAd: -1 });

  return stories;
};