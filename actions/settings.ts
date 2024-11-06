"use server";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { genrateTwoFactorToken, genrateVerificationToken } from "@/lib/tokens";
import { settingSchema } from "@/schemas";
import bcrypt from "bcryptjs";

import * as z from "zod";

export async function updateSettings(data: z.infer<typeof settingSchema>) {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });
  if (!dbUser) {
    return { error: "User not found" };
  }

  if (user.isOAuth) {
    data.email = undefined;
    data.password = undefined;
    data.newPassword = undefined;
  }

  if (data.email && data.email !== user.email) {
    const existingUser = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await genrateVerificationToken(data.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success: "Verification email sent!",
    };
  }

  if (data.password && data.newPassword && dbUser.password) {
    const valid = await bcrypt.compare(data.password, dbUser.password);
    if (!valid) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    data.password = hashedPassword;

    data.newPassword = undefined;
  }

  const updatedUser = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...data,
    },
  });

  return {
    success: "Settings updated",
  };
}

export async function fa(
  otp: string,
  email: string,
  isTwoFactorEnabled: boolean
) {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return { error: "User not found" };
  }

  const twoFactorToken = await getTwoFactorTokenByEmail(email);
  if (!twoFactorToken) {
    return { error: "Invalid Otp!" };
  }

  if (twoFactorToken.token !== otp) {
    return { error: "Invalid Otp!" };
  }
  const hasExpired = new Date(twoFactorToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Otp expired!" };
  }
  await db.twoFactorToken.delete({
    where: {
      id: twoFactorToken.id,
    },
  });

  const updatedUser = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      isTwoFactorEnabled: !isTwoFactorEnabled,
    },
  });

  return { success: "2FA updated!" };
}

export async function sendEmailFor2FA(email: string) {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return { error: "User not found" };
  }

  const verificationToken = await genrateTwoFactorToken(email);

  await sendTwoFactorTokenEmail(
    verificationToken.email,
    verificationToken.token
  );
  return { success: "for 2FA enable code sent!" };
}
