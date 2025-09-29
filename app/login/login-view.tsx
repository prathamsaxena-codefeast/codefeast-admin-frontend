"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
 

export function LoginView() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.message || "Login request failed");
        return;
      }
      console.log("Echoed credentials:", data);
    } catch (err: unknown) {
      if (err instanceof Error && "response" in err) {
        const errorResponse = (err as { response?: { data?: { message?: string } } }).response;
        setError(errorResponse?.data?.message || "An error occurred during login");
      } else {
        setError("An unexpected error occurred during login");
      }
    }
  };
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border bg-card text-card-foreground shadow-xl p-8 md:p-10">
        <div className="space-y-2 text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm md:text-base text-muted-foreground">Enter your credentials to access the dashboard</p>
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
            placeholder="example@gmail.com"
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 border-input dark:border-input focus-visible:ring-2 focus-visible:ring-primary"
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
              className="h-11 pr-10 border-input dark:border-input focus-visible:ring-2 focus-visible:ring-primary"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
            className="text-sm font-medium text-primary hover:text-primary/90"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-primary-foreground"
        >
          Log In
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?
          <a
            href="/signup"
            className="ml-1 font-medium text-primary hover:text-primary/90"
          >
            Sign up
          </a>
        </div>
      </form>
      </div>
    </div>
  );
}
