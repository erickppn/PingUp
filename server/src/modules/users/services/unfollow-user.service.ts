import { User } from "@/modules/users/users.model";

type FollowUsersParams = {
  loggedUserId: string,
  toUnfollowUserId: string
}

export async function unfollowUserService({ loggedUserId, toUnfollowUserId }: FollowUsersParams) {
  const loggedUser = await User.findById(loggedUserId);

  if (!loggedUser) {
    throw new Error("User not found");
  }

  loggedUser.following = loggedUser.following.filter(user => user !== toUnfollowUserId);
  await loggedUser.save();

  const toUnfollowUser = await User.findById(toUnfollowUserId);

  if (!toUnfollowUser) {
    throw new Error("The user you are trying to unfollow does not exist")
  }

  toUnfollowUser.followers = toUnfollowUser.followers.filter(user => user !== loggedUserId);
  await toUnfollowUser.save();
}