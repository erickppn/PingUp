import { User } from "@/modules/users/users.model";

type FollowUsersParams = {
  loggedUserId: string,
  toFollowUserId: string
}

export async function followUserService({ loggedUserId, toFollowUserId }: FollowUsersParams) {
  const loggedUser = await User.findById(loggedUserId);

  if (!loggedUser) {
    throw new Error("User not found");
  }

  if (loggedUser.following.includes(toFollowUserId)) {
    throw new Error("You are already follwing this user");
  }

  loggedUser.following.push(toFollowUserId);
  await loggedUser.save();

  const tofollowUser = await User.findById(toFollowUserId);

  if (!tofollowUser) {
    throw new Error("The user you are trying to follow does not exist.");
  }

  tofollowUser.followers.push(loggedUserId);
  await tofollowUser.save();
}