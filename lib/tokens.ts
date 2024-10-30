import { getVerificationTokenByEmail } from "@/data/verification-token";
import { db } from "./db";
import jwt from "jsonwebtoken";

export const genratePasswordResetToken = async (email: string) => {
  const payload: object = {
    email,
  };
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now
  const exisingToken = await getVerificationTokenByEmail(email);
  if (exisingToken) {
    await db.verificationToken.delete({
      where: {
        id: exisingToken.id,
      },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
export const genrateVerificationToken = async (email: string) => {
  const payload: object = {
    email,
  };
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now
  const exisingToken = await getVerificationTokenByEmail(email);
  if (exisingToken) {
    await db.verificationToken.delete({
      where: {
        id: exisingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};
