"use server";
import { registerSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const register = async (values: z.infer<typeof registerSchema>) => {
  const validated = registerSchema.safeParse(values);
  if (!validated.success) {
    return { error: "Invalid fields" };
  }

  const { name, email, password } = validated.data;
  const hashedPassword = await bcrypt.hashSync(password, 10);
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return { error: "User already exists" };
  }

  try {
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    console.log(newUser);

    return { success: "Registered successfully" };
  } catch (error) {
    // Handle any errors that occur during user creation
    console.error("Error creating user:", error);
    return { error: "An error occurred during registration" };
  }
};
