"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";

export default function Verification() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const verifyEmail = () => {
    if (!token) {
      setError("Missing token");
   
      return;
    }

    newVerification(token)
      .then((data) => {
        if (data?.success) {
         
          setSuccess(data.success || "Email Verified Successfully!");
        }
        if (data?.error) {
        
          setError(data.error || "Verification failed.");
        }
      })
      .catch(() => {
      
        setError("Something went wrong. Please try again later.");
      });
  };

  useEffect(() => {
    verifyEmail();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Email Verification
          </CardTitle>
          <CardDescription className="text-center">
            We&apos;re verifying your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          {!success && !error && (
            <div className="flex flex-col items-center space-y-4">
              <BeatLoader color="#3b82f6" size={20} />
              <p className="text-sm text-gray-500">Verifying your email...</p>
            </div>
          )}
          {success && (
            <div className="flex flex-col items-center space-y-4">
              <svg
                className="h-16 w-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-semibold text-green-600">{success}</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center space-y-4">
              <svg
                className="h-16 w-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-semibold text-red-600">{error}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {/* {verificationStatus !== "loading" && (
            <Button onClick={() => (window.location.href = "/")}>
              {success ? "Go to Dashboard" : "Try Again"}
            </Button>
          )} */}
        </CardFooter>
      </Card>
    </div>
  );
}
