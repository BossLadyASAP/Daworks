import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Register() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    shopName: "",
    ownerName: "",
    phone: "",
    orangePhone: "",
    mtnPhone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("Registration successful!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.password ||
      !formData.shopName ||
      !formData.ownerName ||
      !formData.phone
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsLoading(true);
    await registerMutation.mutateAsync({
      email: formData.email,
      password: formData.password,
      shopName: formData.shopName,
      ownerName: formData.ownerName,
      phone: formData.phone,
      orangePhone: formData.orangePhone || undefined,
      mtnPhone: formData.mtnPhone || undefined,
    });
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

          <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
          <p className="text-center text-muted-foreground mb-6">Start managing your store</p>

          <form onSubmit={handleSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name *</Label>
              <Input
                id="shopName"
                name="shopName"
                placeholder="Your Shop Name"
                value={formData.shopName}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name *</Label>
              <Input
                id="ownerName"
                name="ownerName"
                placeholder="Your Name"
                value={formData.ownerName}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+237..."
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orangePhone">Orange Money Number</Label>
              <Input
                id="orangePhone"
                name="orangePhone"
                placeholder="+237..."
                value={formData.orangePhone}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mtnPhone">MTN Mobile Money Number</Label>
              <Input
                id="mtnPhone"
                name="mtnPhone"
                placeholder="+237..."
                value={formData.mtnPhone}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0066FF] hover:bg-[#0052CC] mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#0066FF] hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
