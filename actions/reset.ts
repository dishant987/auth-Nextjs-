"use server";

import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";
import { genratePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import * as z from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validated = ResetSchema.safeParse(values);
  if (!validated.success) {
    return {
      error: "Invalid email address",
    };
  }

  const { email } = validated.data;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!existingUser) {
    return {
      error: "Email not found",
    };
  }
  const passwordResetToken = await genratePasswordResetToken(email);
  await sendPasswordResetEmail(email, passwordResetToken.token);
  return {
    success: "Reset link sent",
  };
};
