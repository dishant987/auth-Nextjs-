"use server";

import { loginSchema } from "@/schemas";
import { z } from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { genrateVerificationToken } from "@/lib/tokens";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validated = loginSchema.safeParse(values);

  if (!validated.success) {
    return { error: "Invalid fields" };
  }
  const { email, password } = validated.data;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "User not found" };
  }
  console.log("out side verify");
  if (!existingUser.emailVerified) {
    const token = await genrateVerificationToken(existingUser.email);
    console.log("inside verify");
    return { success: "Confrmation email sent!" };
  }
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { success: "Logged in successfully" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};
