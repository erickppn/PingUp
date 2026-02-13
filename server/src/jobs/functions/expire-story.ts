import { inngest } from "@/jobs/client"; 
import { EVENTS } from "@/jobs/events";
import { expireStoryService } from "@/modules/storys/services/expire-story.service";

export const expireStory = inngest.createFunction(
  { id: 'expire-story' },
  { event: EVENTS.STORY_CREATED },

  async ({ event, step }) => {
    const { storyId } = event.data;

    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await step.sleepUntil('await-for-24-hours', in24Hours);

    await step.run('delete-story', async () => {
      await expireStoryService(storyId);
    });

    return { message: "Story deleted" }
  }
);