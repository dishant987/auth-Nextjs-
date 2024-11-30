import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[360px] md:w-[400px]">
        <CardHeader className="flex flex-col justify-center items-center space-y-2">
          <Skeleton className="h-20 w-20 rounded-full" />{" "}
          {/* Logo placeholder */}
       
          <Skeleton className="h-4 w-48" /> {/* Description placeholder */}
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" /> {/* Email label */}
            <Skeleton className="h-10 w-full" /> {/* Email input */}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" /> {/* Password label */}
            <Skeleton className="h-10 w-full" /> {/* Password input */}
          </div>
          <Skeleton className="h-4 w-28" /> {/* Reset password link */}
          <Skeleton className="h-10 w-full" /> {/* Login button */}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          
          <Skeleton className="h-4 w-48 mx-auto" /> {/* Register link */}
        </CardFooter>
      </Card>
    </div>
  );
}
