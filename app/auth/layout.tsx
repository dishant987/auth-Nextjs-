import React, { ReactNode, Suspense } from "react";
import { AuthSkeleton } from "@/components/authSkeleton";

const LoginLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full flex justify-center items-center bg-gradient-to-br from-blue-600 via-blue-200 to-gray-400">
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="flex flex-col min-h-screen items-center justify-center space-y-4">
    <AuthSkeleton />
  </div>
);

export default LoginLayout;
