import { User } from "@/modules/users/users.model";

import { UserNotFoundError, TargetUserNotFoundError } from "@/shared/errors/user/not-found.error";
import { AlreadyFollowingUserError, CannotFollowYourselfError } from "@/shared/errors/user/follow.error";

type FollowUsersParams = {
  loggedUserId: string,
  toFollowUserId: string
}

export async function followUserService({ loggedUserId, toFollowUserId }: FollowUsersParams) {
  const loggedUser = await User.findById(loggedUserId);

  if (!loggedUser) {
    throw new UserNotFoundError();
  }

  if (toFollowUserId === loggedUser._id) {
    throw new CannotFollowYourselfError();
  }
  
  if (loggedUser.following.includes(toFollowUserId)) {
    throw new AlreadyFollowingUserError();
  }

  const tofollowUser = await User.findById(toFollowUserId);

  if (!tofollowUser) {
    throw new TargetUserNotFoundError("follow");
  }

  tofollowUser.followers.push(loggedUser._id);
  await tofollowUser.save();

  loggedUser.following.push(tofollowUser._id);
  await loggedUser.save();
}