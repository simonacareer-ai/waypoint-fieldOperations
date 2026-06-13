"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="text-center mb-8">
        <div className="mx-auto h-14 w-14 rounded-lg bg-primary flex items-center justify-center mb-4">
          <span className="text-primary-foreground font-bold text-xl">W</span>
        </div>
        <h1 className="text-[28px] leading-[34px] font-bold text-foreground">
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your email to receive a reset link
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="simona@waypoint.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                required
              />
            </div>

            <Button type="submit" className="w-full h-14 text-base font-semibold">
              <Mail className="h-5 w-5 mr-2" />
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-success-50 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-success-700" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Check your email</h3>
            <p className="text-sm text-muted-foreground">
              We sent a password reset link to <strong>{email}</strong>
            </p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-border">
          <Link href="/login">
            <Button variant="ghost" className="w-full h-12">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
