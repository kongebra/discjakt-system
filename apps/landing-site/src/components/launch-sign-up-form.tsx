"use client";

import { signUpEmailAction } from "@/app/actions";
import React, { useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { useFormState } from "react-dom";
import { toast } from "./ui/use-toast";

const LaunchSignUpForm = () => {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");

  return (
    <>
      <form
        action={(formData) => {
          startTransition(async () => {
            await signUpEmailAction(formData);
            toast({
              title: "Thank you for signing up!",
              description: "We will notify you when we launch.",
              variant: "success",
            });
            setEmail("");
          });
        }}
      >
        <div className="flex space-x-2">
          <div className="max-w-lg flex-1">
            <Input
              placeholder="Enter your email"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>
          <Button variant="secondary" type="submit" disabled={isPending}>
            Sign Up
          </Button>
        </div>
      </form>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {`Sign up to get notified when we launch. `}
        <Link className="underline underline-offset-2" href="/privacy">
          Terms & Conditions
        </Link>
      </p>
    </>
  );
};

export default LaunchSignUpForm;

