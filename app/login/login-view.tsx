import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import { ForgotPasswordModal } from "@/components/reset-password";

export const LoginForm = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordScreen, setForgotPasswordScreen] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setIsLoading(true);
      const response = await login(email, password);
    } catch (err: any) {
      let message = "Something went wrong. Please try again.";

      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      toast.error(message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setForgotPasswordScreen(true);
  };

  return (
    <div className="flex flex-col justify-center min-h-screen bg-[#0A0A0A] text-white p-8 md:p-12 relative">
      <div className="flex flex-col justify-center flex-grow">
        <div className="max-w-sm w-full mx-auto">
          <h1 className="text-3xl font-semibold mb-2 text-center">
            Login to your account
          </h1>
          <p className="text-gray-400 mb-6 text-center">
            Please enter your details to login.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border-3 border-[#2c2c2c]  bg-[#202020] px-3 py-2 text-sm text-white placeholder:text-[#b8b8b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 ring-offset-black"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="flex h-10 w-full  rounded-md border-3 border-[#2c2c2c] bg-[#202020] px-3 py-2 text-sm text-white placeholder:text-[#b8b8b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 ring-offset-black pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="min-h-[20px] pt-1">
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  title="Remember me"
                  className="h-4 w-4 rounded border-gray-600 bg-[#202020] text-white focus:ring-white focus:ring-offset-black"
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-gray-400 select-none cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="p-0 text-sm font-medium text-gray-400 hover:text-white"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-white text-black hover:bg-gray-200 h-10 px-4 py-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={16} />
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
      <p className="text-sm text-gray-400">&copy; 2025 Codefeast</p>
      <ForgotPasswordModal
        open={forgotPasswordScreen}
        onOpenChange={setForgotPasswordScreen}
      />
    </div>
  );
};
