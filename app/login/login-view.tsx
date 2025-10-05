"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AxiosError } from "axios";
import Link from "next/link";

export function LoginView() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
    } catch (err) {
      let message = "Something went wrong. Please try again.";

      if (err instanceof AxiosError && err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border bg-card text-card-foreground shadow-xl p-8 md:p-10">
        <div className="space-y-2 text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Enter your credentials to access the dashboard
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="example@gmail.com"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-11 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="min-h-[5px]">
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                title="Remember me"
                className="h-4 w-4 rounded border-border"
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm font-medium text-muted-foreground">
                Remember me
              </Label>
            </div>
            <Link href="#" className="text-sm font-medium text-primary hover:text-primary/90">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                Logging in...
              </div>
            ) : (
              "Log In"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?
            <Link href="/signup" className="ml-1 font-medium text-primary hover:text-primary/90">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
