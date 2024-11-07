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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader, CheckCircle } from "lucide-react";
import { ResetSchema } from "@/schemas";
import Link from "next/link";
import FormError from "@/components/form-error";
import { reset } from "@/actions/reset";

export default function ResetPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof ResetSchema>) {
    setError(null);
    setSuccess(null);
    // Here you would typically send the login request to your server
    startTransition(() => {
      reset(values)
        .then((res) => {
          setError(res?.error || null);
          setSuccess(res?.success || null);
        })
        .catch(() => {
          setError("Something went wrong. Please try again later");
        });
    });
    // Simulating API call
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[360px] md:w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
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

              {error ? <FormError message={error} /> : null}

              {success && (
                <p className="flex items-center text-green-500 bg-green-50 rounded-lg p-2  gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {success}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Send Email
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Link href="/auth/login" className="text-center text-sm">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
