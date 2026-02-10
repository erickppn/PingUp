import { User } from "@/modules/users/users.model";
import { UserNotFoundError, TargetUserNotFoundError } from "@/shared/errors/user/not-found.error";

type FollowUsersParams = {
  loggedUserId: string,
  toUnfollowUserId: string
}

export async function unfollowUserService({ loggedUserId, toUnfollowUserId }: FollowUsersParams) {
  const loggedUser = await User.findById(loggedUserId);

  if (!loggedUser) {
    throw new UserNotFoundError();
  }

  const toUnfollowUser = await User.findById(toUnfollowUserId);

  if (!toUnfollowUser) {
    throw new TargetUserNotFoundError("unfollow");
  }

  loggedUser.following = loggedUser.following.filter(user => user !== toUnfollowUserId);
  await loggedUser.save();

  toUnfollowUser.followers = toUnfollowUser.followers.filter(user => user !== loggedUserId);
  await toUnfollowUser.save();
}