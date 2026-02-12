import { User } from "@/modules/users/users.model";
import { Post } from "@/modules/posts/posts.model";

import { UserNotFoundError } from "@/shared/errors/user/not-found.error";

export async function getFeedService(loggedUserId: string ) {
  const loggedUser = await User.findById(loggedUserId);

  if (!loggedUser) {
    throw new UserNotFoundError();
  }

  const ids = [loggedUserId, ...loggedUser.connections, ...loggedUser.following];

  const userIds = [...new Set(ids)];

  const posts = await Post.find({
    user: { $in: userIds }
  }).populate("user").sort({
    createdAt: -1
  });

  return posts;
}