import z from "zod";

export const addStoryInputSchema = z.object({
  content: z.string(),

  media_type: z.enum(['text', 'image', 'video']),

  background_color: z.string()
});

export type addStoryInput = z.infer<typeof addStoryInputSchema>;