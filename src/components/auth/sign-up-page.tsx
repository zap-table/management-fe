"use client";

import { mutateSignUpOwnerUser } from "@/actions/auth.actions";
import { SignUpOwnerUser, SignUpOwnerUserSchema } from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ChefHat } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export default function SignUpPage() {
  const router = useRouter();

  const form = useForm<SignUpOwnerUser>({
    resolver: zodResolver(SignUpOwnerUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: SignUpOwnerUser) => {
      return await mutateSignUpOwnerUser(data);
    },
    onSuccess: () => {
      router.push("/sign-in");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: SignUpOwnerUser) => {
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
          Regista-se para gerir os seus restaurantes
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmação da password</FormLabel>
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
              {mutation.isPending ? "A registar..." : "Registe-se"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
}
