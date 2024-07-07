import { z } from "zod";

export const NotifyMeRequest = z.object({
  name: z.string().min(3).max(255),
  email: z
    .string({
      message: "Invalid email address",
    })
    .email({
      message: "Invalid email address",
    }),
});
