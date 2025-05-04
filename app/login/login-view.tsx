"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/authContext";

export function LoginView() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during login");
    }
  };
  return (
    <div className="w-full max-w-md space-y-8 p-6 rounded-lg border border-border dark:border-border bg-card dark:bg-card shadow-sm">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground dark:text-foreground">
          Welcome back
        </h1>
        <p className="text-muted-foreground dark:text-muted-foreground">
          Enter your credentials to sign in to your account
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-foreground dark:text-foreground"
          >
            Email
          </Label>
          <Input
            id="email"
            placeholder="example@divyanshi.com"
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="border-input dark:border-input focus:border-primary dark:focus:border-primary focus:ring-primary dark:focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-foreground dark:text-foreground"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Enter your password"
              className="border-input dark:border-input focus:border-primary dark:focus:border-primary focus:ring-primary dark:focus:ring-primary pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {error && <p className='text-sm text-red-500'>{error}</p>}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              title="Remember me"
              className="h-4 w-4 rounded border-border dark:border-border text-primary dark:text-primary focus:ring-primary dark:focus:ring-primary"
            />
            <Label
              htmlFor="remember"
              className="text-sm font-medium text-muted-foreground dark:text-muted-foreground"
            >
              Remember me
            </Label>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-primary dark:text-primary hover:text-primary/90 dark:hover:text-primary/90"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary dark:bg-primary hover:bg-primary/90 dark:hover:bg-primary/90 text-primary-foreground dark:text-primary-foreground"
        >
          Sign In
        </Button>

        <div className="text-center text-sm text-muted-foreground dark:text-muted-foreground">
          Don&apos;t have an account?
          <a
            href="/signup"
            className="font-medium text-primary dark:text-primary hover:text-primary/90 dark:hover:text-primary/90"
          >
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
}
