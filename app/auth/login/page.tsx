"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  EyeIcon,
  EyeOffIcon,
  Loader,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { loginSchema } from "@/schemas";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { login } from "@/actions/login";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";
import FormError from "@/components/form-error";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with another account"
      : "";
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null);
    setSuccess(null);
    // Here you would typically send the login request to your server
    startTransition(() => {
      login(values).then((data) => {
        
        setError(data?.error || null);
        setSuccess(data?.success || null);
      });
    });
    // Simulating API call
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Welcome back! Please enter your details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error || urlError ? (
                <FormError message={error || urlError} />
              ) : null}

              {success && (
                <p className="flex items-center text-green-500 bg-green-50 rounded-lg p-2  gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {success}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Log in
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex gap-2 w-full">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => onClick("github")}
            >
              <GitHubLogoIcon className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => onClick("google")}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>

          <Link
            href="/auth/register"
            className="text-center text-sm text-muted-foreground"
          >
            Don&apos;t have an account?{" "}
            <span className="underline text-foreground">Register</span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
