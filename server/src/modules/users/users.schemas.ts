import z from "zod";

export const UserSchema = z.object({
  _id: z.string(),
  username: z.string(),
  bio: z.string(),
  location: z.string(),
  full_name: z.string(),

});

export const updateUserInputSchema = z.object({
  username: z.string(),
  bio: z.string(),
  location: z.string(),
  full_name: z.string(),
});

export const searchUsersQuerySchema = z.object({
  search_query: z.string()
});

export const followUserParamsSchema = z.object({
  id: z.string()
});

export const unfollowUserParamsSchema = z.object({
  id: z.string()
});