import z from "zod";

export const UserSchema = z.object({
  _id: z.string(),
  username: z.string(),
  bio: z.string(),
  location: z.string(),
  full_name: z.string(),

});

export const createUserInputSchema = z.object({
  id: z.string(),
  full_name: z.string(),

  email: z.email({
    error: (err) => err.input === undefined
      ? 'Email field is required'
      : 'Invalid email format',
  }),

  image_url: z.string()
});
export type CreateUserInput = z.infer<typeof createUserInputSchema>

export const updateUserInputSchema = z.object({
  id: z.string(),
  full_name: z.string(),

  email: z.email({
    error: (err) => err.input === undefined
      ? 'Email field is required'
      : 'Invalid email format',
  }),

  image_url: z.string()
});
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>

export const updateProfileInputSchema = z.object({
  username: z.string(),
  bio: z.string(),
  location: z.string(),
  full_name: z.string(),
});
export type UpdateUserProfileInput = z.infer<typeof updateProfileInputSchema>

export const searchUsersQuerySchema = z.object({
  search_query: z.string()
});

export const followUserParamsSchema = z.object({
  id: z.string()
});

export const unfollowUserParamsSchema = z.object({
  id: z.string()
});