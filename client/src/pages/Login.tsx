import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      toast.success("Login successful!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    await loginMutation.mutateAsync({ email, password });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001F3F] to-[#0066FF] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/manus-storage/WhatsApp_Image_2026-06-15_at_2.15.38_PM-removebg-preview_0d19d585.png"
              alt="Daworks"
              className="h-20"
            />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Daworks Store</h1>
          <p className="text-center text-muted-foreground mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0066FF] hover:bg-[#0052CC]"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[#0066FF] hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
