import { buildURL, uploadToImageKit } from "@/shared/providers/media/imagekit/imagekit.provider";

import { AddPostInput } from "@/modules/posts/posts.schemas";
import { FileData } from "@/shared/providers/media/media.provider";

import { User } from "@/modules/users/users.model";
import { Post } from "../posts.model";

import { UserNotFoundError } from "@/shared/errors/user/not-found.error";
import { PostContentTooLongError, TooManyImagesError } from "@/shared/errors/posts/create-post.error";

type AddPostData = AddPostInput & {
  loggedUserId: string,
  images: FileData[]
}

const MAX_CONTENT_LENGTH = 500;
const MAX_IMAGES = 4;

export async function addPostService({
  loggedUserId,
  content,
  post_type,
  images = []
}: AddPostData) {
  const loggedUser = await User.findById(loggedUserId);

  if (!loggedUser) {
    throw new UserNotFoundError();
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    throw new PostContentTooLongError(MAX_CONTENT_LENGTH);
  }

  if (images.length > MAX_IMAGES) {
    throw new TooManyImagesError(MAX_IMAGES);
  }

  const imagesUrls = await Promise.all(
    images.map(async (image) => {
      const uploadedImage = await uploadToImageKit(image);

      const url = buildURL(uploadedImage.url, {
        transformation: [
          { quality: 100 },
          { format: 'webp' },
          { width: '1280' }
        ]
      });

      return url;
    })
  );

  await Post.create({
    user: loggedUser._id,
    content,
    image_urls: imagesUrls,
    post_type
  });
}