import React from "react";
import Navbar from "./_components/navbar";
import Footer from "./_components/footer";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <div className="min-h-screen flex flex-col gap-y-5 items-center   bg-gradient-to-br from-blue-600 via-blue-200 to-gray-400">
        <Navbar />
        {children}
        <Footer />
      </div>
    </SessionProvider>
  );
};

export default layout;
