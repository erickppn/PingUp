import z from "zod";

export const connectionRequestParamsSchema = z.object({
  id: z.string()
});

export const acceptConnectionRequestParamsSchema = z.object({
  id: z.string()
});