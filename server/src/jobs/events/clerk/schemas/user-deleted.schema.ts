import z from "zod";

export const ClerkUserDeletedEventSchema = z.object({
  id: z.string(),
});

export type ClerkUserDeletedEventData = z.infer<typeof ClerkUserDeletedEventSchema>;