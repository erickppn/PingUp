import z from "zod";

export const UserSchema = z.object({
  _id: z.string(),
  username: z.string(),
  bio: z.string(),
  location: z.string(),
  full_name: z.string(),
  
});

export const updateUserInputSchema = z.object({
  fields: z.object({
    username: z.string(),
    bio: z.string(),
    location: z.string(),
    full_name: z.string(),
  }),

  files: z.object({
    profile: z.array(
      z.object({
        name: z.string(),
        filePath: z.string(),
        url: z.string(),
      })
    ).length(1).optional(),

    cover: z.array(
      z.object({
        name: z.string(),
        filePath: z.string(),
        url: z.string(),
      })
    ).length(1).optional(),
  }),
});
