import { auth } from "@/auth";
import React from "react";
import { UserInfo } from "../_components/user-info";
import { Server } from "lucide-react";

const page = async () => {
  const session = await auth();
  return (
    <UserInfo
      user={session?.user}
      label=" Server Component"
      icon={<Server className="h-6 w-6" />}
    />
  );
};

export default page;
