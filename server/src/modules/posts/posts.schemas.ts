import z from "zod";

export const addPostInputSchema = z.object({
  content: z.string(),
  post_type: z.enum(['text', 'image', 'text_with_image'])
});

export type AddPostInput = z.infer<typeof addPostInputSchema>;