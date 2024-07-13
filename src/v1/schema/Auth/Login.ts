import { z } from "zod";

export const LoginSchema = z.object({
  usernameOrEmail: z.string(),
  password: z.string().min(8),
});

export type LoginType = z.infer<typeof LoginSchema>;
