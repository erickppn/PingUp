import { Post } from "@/modules/posts/posts.model";
import { PostNotFoundError } from "@/shared/errors/posts/not-found.error";

type toggleLikeData = {
  loggedUserId: string;
  postId: string
}

export async function toggleLikeService({ loggedUserId, postId }: toggleLikeData) {
  const post = await Post.findById(postId);

  if (!post) {
    throw new PostNotFoundError();
  }

  const alreadyLiked = post.likes_count.includes(loggedUserId);
  
  if (alreadyLiked) {
    post.likes_count = post.likes_count.filter(user => user !== loggedUserId);
  } else {
    post.likes_count.push(loggedUserId);
  }

  await post.save();

  return {
    liked: !alreadyLiked,
    likesCount: post.likes_count.length
  };
}