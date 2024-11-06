"use client";
import React from "react";
import { UserInfo } from "../_components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";
import { User } from "lucide-react";

const Client = () => {
  const user = useCurrentUser();
  return (
    <UserInfo
      user={user}
      label=" Client Component"
      icon={<User className="h-6 w-6" />}
    />
  );
};

export default Client;
