import { PrismaClient } from "@prisma/client";


declare global {
  // Use `let` for prisma to avoid `var`
  let prisma: PrismaClient | undefined;
}

// Create a single instance of PrismaClient
export const db =  new PrismaClient();

