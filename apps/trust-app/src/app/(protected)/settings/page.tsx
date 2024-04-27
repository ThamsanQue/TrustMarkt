"use client";

import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useTransition } from "react";
import { z } from "zod";
import { SettingsSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Switch } from "@/components/ui/switch";
import { logout } from "@/actions/logout";
import { toast } from "sonner";

const Settings = () => {
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((res) => {
          if (res.error) {
            toast.error(res.error);
          }

          if (res.success) {
            update();
            toast.success(res.success);
          }
        })
        .catch((err) => toast.error("Something went wrong", err));
    });
  };

  const onClick = () => {
    logout();
  };
  return (
    <div className="flex h-full w-full flex-col">
      <main className="flex  flex-1 flex-col gap-4  p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold text-white">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="grid gap-4 text-sm  text-white/75"
            x-chunk="dashboard-04-chunk-0"
          >
            <h2 className="rounded-md bg-white/10 p-2 font-semibold text-white">
              Profile
            </h2>
            <h2 className="rounded-md p-2 hover:bg-white/20">Security</h2>
            <h2 className=" rounded-md p-2 hover:bg-white/20">Integrations</h2>
            <h2 className=" rounded-md p-2 hover:bg-white/20">Support</h2>
            <h2 className=" rounded-md p-2 hover:bg-white/20">Organizations</h2>
            <h2 onClick={onClick} className=" rounded-md p-2 hover:bg-white/20">
              Sign Out
            </h2>
          </nav>
          <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                    id="personalInfo-form"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="John Doe"
                              disabled={isPending}
                            />
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
                              <Input
                                {...field}
                                placeholder="john.doe@example.com"
                                disabled={isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  disabled={isPending}
                  type="submit"
                  form="personalInfo-form"
                >
                  Save
                </Button>
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-04-chunk-2">
              <CardHeader>
                <CardTitle>Password Credentials</CardTitle>
                <CardDescription>
                  Enter your current password to change your password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                    id="password-form"
                  >
                    {user?.isOAuth === false && (
                      <>
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="******"
                                  disabled={isPending}
                                  type="password"
                                />
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
                                <Input
                                  {...field}
                                  placeholder="******"
                                  disabled={isPending}
                                  type="password"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="isTwoFactorEnabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Two Factor Authentication</FormLabel>
                                <FormDescription>
                                  Enable/ Disable two factor Authentication for
                                  your account .
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  disabled={isPending}
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button disabled={isPending} type="submit" form="password-form">
                  Save
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Settings;
