import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Eye, EyeOff, Lock, Phone, User, Store } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    phone: "",
    orangePhone: "",
    mtnPhone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const registerMutation = trpc.auth.register.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.shopName || !formData.ownerName || !formData.phone || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await registerMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        shopName: formData.shopName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        orangePhone: formData.orangePhone,
        mtnPhone: formData.mtnPhone,
      });
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
          Create your store
        </h1>
        <p className="text-center text-gray-600 mb-8 text-sm">
          It's free and quick.
        </p>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Shop Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              SHOP NAME
            </label>
            <div className="relative">
              <Store className="absolute left-4 top-3 text-gray-400" size={18} />
              <Input
                type="text"
                name="shopName"
                placeholder="Ex: My Shop"
                value={formData.shopName}
                onChange={handleChange}
                className="pl-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
          </div>

          {/* Owner Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              FULL NAME
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3 text-gray-400" size={18} />
              <Input
                type="text"
                name="ownerName"
                placeholder="John Doe"
                value={formData.ownerName}
                onChange={handleChange}
                className="pl-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
          </div>

          {/* Reception Accounts */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-4">Payment accounts:</p>

            {/* Orange Phone */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                ORANGE MONEY NUMBER
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-3 text-gray-400" size={18} />
                <Input
                  type="tel"
                  name="orangePhone"
                  placeholder="+237 6XX XXX XXX"
                  value={formData.orangePhone}
                  onChange={handleChange}
                  className="pl-12 pr-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
                <div className="absolute right-3 top-2.5 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                  Orange
                </div>
              </div>
            </div>

            {/* MTN Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                MTN MOMO NUMBER
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-3 text-gray-400" size={18} />
                <Input
                  type="tel"
                  name="mtnPhone"
                  placeholder="+237 6XX XXX XXX"
                  value={formData.mtnPhone}
                  onChange={handleChange}
                  className="pl-12 pr-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
                <div className="absolute right-3 top-2.5 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                  MTN
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex gap-2 text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
            <span className="text-lg">ℹ️</span>
            <span>At least one payment account is required to receive customer payments.</span>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              EMAIL ADDRESS
            </label>
            <Input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className="py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>

          {/* Security Section */}
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Security:</h3>

            {/* Password */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 text-gray-400" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mt-6"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#0066FF] hover:underline font-semibold"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
