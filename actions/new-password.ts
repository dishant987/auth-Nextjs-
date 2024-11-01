"use server";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { passwordSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const newPassword = async (
  values: z.infer<typeof passwordSchema>,
  token?: string
) => {
  if (!token) {
    return {
      error: "Invalid token",
    };
  }
  const validated = passwordSchema.safeParse(values);
  if (!validated.success) {
    return {
      error: "Invalid password",
    };
  }
  const { password, confirmPassword } = validated.data;

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match",
    };
  }
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return {
      error: "Invalid token",
    };
  }
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return {
      error: "Token has expired",
    };
  }
  
  const existingUser = await db.user.findUnique({
    where: {
      email: existingToken.email,
    },
  });
  if (!existingUser) {
    return {
      error: "Email does not exist!",
    };
  }

  const hashedPassword = await bcrypt.hashSync(password, 10);
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    success: "Password updated successfully!",
  };

}
