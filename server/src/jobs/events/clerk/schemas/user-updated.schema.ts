import z from "zod";

export const ClerkUserUpdatedEventSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),

  email_addresses: z.array(
    z.object({
      email_address: z.string()
    })
  ),

  image_url: z.string()
});

export type ClerkUserUpdatedEventData = z.infer<typeof ClerkUserUpdatedEventSchema>;