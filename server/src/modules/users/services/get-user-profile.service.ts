import { Post } from "@/modules/posts/posts.model";
import { User } from "@/modules/users/users.model";

import { UserNotFoundError } from "@/shared/errors/user/not-found.error";

export async function getUserProfileService(userId: string) {
  const user = await User.findById(userId);

  if (!user) {
    throw new UserNotFoundError();
  }

  const posts = await Post.find({ user: user._id }).populate("user", "_id profile_picture username full_name");

  return {user, posts}
}