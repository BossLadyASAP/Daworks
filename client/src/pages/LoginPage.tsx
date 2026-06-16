import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Eye, EyeOff, Phone, Lock } from "lucide-react";
import { toast } from "sonner";

const LOGO_ICON = "/9ebcf406-5555-4c22-ae85-9cf314f4a04f-removebg-preview.png";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.auth.login.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await loginMutation.mutateAsync({
        email,
        password,
      });
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-[#001F3F] rounded-2xl flex items-center justify-center">
            <img src={LOGO_ICON} alt="Daworks" className="w-14 h-14 object-contain" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
          Welcome back 👋
        </h1>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Sign in to your store
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email/Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              PHONE NUMBER
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-3 text-gray-400" size={18} />
              <Input
                type="email"
                placeholder="Ex: +237 6XX XXX XXX"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-gray-700">
                PASSWORD
              </label>
              <button
                type="button"
                className="text-xs text-[#0066FF] hover:text-[#0052CC] font-semibold"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3 text-gray-400" size={18} />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            New to Daworks?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[#0066FF] hover:text-[#0052CC] font-semibold"
            >
              Create account
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center gap-4 text-xs text-gray-500">
          <button className="hover:text-gray-700">Support</button>
          <span>•</span>
          <button className="hover:text-gray-700">Privacy</button>
        </div>
      </div>
    </div>
  );
}
