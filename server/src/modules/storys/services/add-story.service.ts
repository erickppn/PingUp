import { inngest } from "@/jobs/client";

import { User } from "@/modules/users/users.model";
import { Story } from "@/modules/storys/story.model";

import { addStoryInput } from "@/modules/storys/story.schemas"
import { FileData } from "@/shared/providers/media/media.provider"

import { uploadToImageKit } from "@/shared/providers/media/imagekit/imagekit.provider";

import { UserNotFoundError } from "@/shared/errors/user/not-found.error";
import { EVENTS } from "@/jobs/events";

type AddStoryData = addStoryInput & {
  loggedUserId: string,
  media: FileData | null
}

export async function addStoryService({
  background_color,
  content,
  loggedUserId,
  media,
  media_type
}: AddStoryData) {
  const loggedUser = await User.findById(loggedUserId);

  if (!loggedUser) {
    throw new UserNotFoundError();
  }

  let media_url = "";

  if (media && (media_type === "image" || media_type === "video")) {
    const uploadedMedia = await uploadToImageKit(media);

    media_url = uploadedMedia.url;
  }

  const story = await Story.create({
    user: loggedUser._id,
    content,
    media_type,
    background_color,
    media_url
  });

  await inngest.send({
    name: EVENTS.STORY_CREATED,
    data: {
      storyId: story._id.toString()
    },

    id: story._id.toString()
  })

  return story;
}