"use client";
import { useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import {
  CheckCircle,
  EyeIcon,
  EyeOffIcon,
  Loader,
  Settings,
} from "lucide-react";
import { settingSchema } from "@/schemas";
import { useCurrentUser } from "@/hooks/use-current-user";
import { fa, sendEmailFor2FA, updateSettings } from "@/actions/settings";
import { useSession } from "next-auth/react";
import FormError from "@/components/form-error";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, {
      message: "OTP must be exactly 6 digits.",
    })
    .regex(/^\d+$/, {
      message: "OTP must contain only numbers.",
    }),
});

type SettingsFormValues = z.infer<typeof settingSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export default function SettingsPage() {
  const user = useCurrentUser();
  const { update } = useSession();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const defaultValues: Partial<SettingsFormValues> = {
    name: user?.name || undefined,
    email: user?.email || undefined,
    password: undefined,
    newPassword: undefined,
  };
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingSchema),
    defaultValues,
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  function onSubmit(data: SettingsFormValues) {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      updateSettings(data)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }
          if (data?.success) {
            console.log(data);
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => {
          setError("Something went wrong. Please try again later.");
        });
    });
    // toast({
    //   title: "Settings updated",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  function onOtpSubmit(data: OtpFormValues) {
    startTransition(() => {
      fa(
        data.otp,
        user?.email as string,
        user?.isTwoFactorEnabled as boolean
      ).then((data) => {
        if (data?.error) {
          toast({
            title: "2FA Error",
            description: data.error,
          });
          return;
        }
        if (data?.success) {
          toast({
            title: "2FA Enabled",
            description: data.success,
          });
        }
      });
    });
    toast({
      title: "2FA Enabled",
      description: `OTP verified: ${data.otp}`,
    });
    setShowOtpModal(false);
  }

  function handle2FAToggle() {
    startTransition(() => {
      sendEmailFor2FA(user?.email as string).then((data) => {
        if (data?.error) {
          toast({
            title: "2FA Error",
            description: data.error,
          });
          return;
        }
        if (data?.success) {
          toast({
            title: "2FA Enabled",
            description: data.success,
          });
        }
      });
    });
    setShowOtpModal(true);
  }

  return (
    <div className="p-6 rounded-lg mx-auto max-h-dvh bg-slate-50 w-[97%]">
      <div className="flex items-center justify-center mb-6">
        <Settings className="mr-2 h-8 w-8" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      <div className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input  className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user?.isOAuth === false && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            {user?.isOAuth === false && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="•••••••"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute right-0 top-0 h-full px-3 py-2"
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
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="•••••••••"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute right-0 top-0 h-full px-3 py-2"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            aria-label={
                              showNewPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showNewPassword ? (
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
              </div>
            )}
            {error && <FormError message={error} />}
            {success && (
              <p className="flex items-center text-green-500 bg-green-50 rounded-lg p-2 gap-2">
                <CheckCircle className="h-4 w-4" />
                {success}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>

        {user?.isOAuth === false && (
          <div className="flex items-center space-x-2 p-2">
            <Switch
              id="2fa"
              checked={user?.isTwoFactorEnabled}
              onCheckedChange={handle2FAToggle}
            />
            <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
          </div>
        )}
      </div>

      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable 2FA</DialogTitle>
            <DialogDescription>
              Enter the 6-digit code from your authenticator app to enable 2FA.
            </DialogDescription>
          </DialogHeader>
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onOtpSubmit)}
              className="space-y-8"
            >
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>6-Digit Code</FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={6} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Verify and Enable 2FA</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
