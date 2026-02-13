import { Story } from "@/modules/storys/story.model";
import { StoryNotFoundError } from "@/shared/errors/storys/not-found.error";

export async function expireStoryService(storyId: string) {
  const story = await Story.findById(storyId);

  if (!story) {
    throw new StoryNotFoundError();
  }

  await Story.deleteOne({
    _id: storyId
  });
}