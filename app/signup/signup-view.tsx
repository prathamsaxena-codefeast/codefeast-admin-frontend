"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/lib/authContext";

export function SignupView() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { setTokens } = useAuth();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/user/signup", { name, email, password, role });
      setTokens(data.accessToken, data.refreshToken); // Store tokens in AuthContext
      setSuccess(data.message);
      setError("");
      setTimeout(() => {
        router.push("/login"); // Redirect to login page after successful signup
      }, 2000);
    } catch (err: any) {
      console.log("Error:", err);
      setError(err.response?.data?.message || "An error occurred during signup");
      setSuccess("");
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 p-6 rounded-lg border border-border dark:border-border bg-card dark:bg-card shadow-sm">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground dark:text-foreground">
          Create an Account
        </h1>
        <p className="text-muted-foreground dark:text-muted-foreground">
          Enter your details to sign up for an account
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground dark:text-foreground">
            Name
          </Label>
          <Input
            id="name"
            placeholder="Your Name"
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-input dark:border-input focus:border-primary dark:focus:border-primary focus:ring-primary dark:focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground dark:text-foreground">
            Email
          </Label>
          <Input
            id="email"
            placeholder="example@divyanshi.com"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-input dark:border-input focus:border-primary dark:focus:border-primary focus:ring-primary dark:focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground dark:text-foreground">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              required
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}

        <Button
          type="submit"
          className="w-full bg-primary dark:bg-primary hover:bg-primary/90 dark:hover:bg-primary/90 text-primary-foreground dark:text-primary-foreground"
        >
          Sign Up
        </Button>

        <div className="text-center text-sm text-muted-foreground dark:text-muted-foreground">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-primary dark:text-primary hover:text-primary/90 dark:hover:text-primary/90"
          >
            Sign in
          </a>
        </div>
      </form>
    </div>
  );
}