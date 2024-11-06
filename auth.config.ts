import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./schemas";
import { db } from "./lib/db";
import bcrypt from "bcryptjs";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      authorize: async (credentials) => {
        const validated = loginSchema.safeParse(credentials);
        if (validated.success) {
          const { email, password } = validated.data;

          const user = await db.user.findUnique({
            where: {
              email,
            },
          });
          if (!user || !user.password) {
            return null;
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (isValid) {
            return user;
          }
          return null;
        } else {
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
