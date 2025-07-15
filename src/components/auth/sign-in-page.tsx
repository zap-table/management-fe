"use client";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SignInUser, SignInUserSchema } from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ChefHat } from "lucide-react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export function SignInPage() {
  const form = useForm<SignInUser>({
    resolver: zodResolver(SignInUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: SignInUser) => {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/business`,
      });

      if (!res?.ok) {
        console.error("error logging", res);
        throw new Error(`Non Ok response code - ${res?.status}`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: SignInUser) => {
    mutation.mutate({
      ...data,
    });
  };

  return (
    <>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <ChefHat className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl">Zap Table</CardTitle>
        <CardDescription>
          Faça login para gerir os seus restaurantes{" "}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Realizando login..." : "Faça login"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
}
