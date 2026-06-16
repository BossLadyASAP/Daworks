import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Eye, EyeOff, Lock, Phone, User, Store } from "lucide-react";
import { toast } from "sonner";

const LOGO_ICON = "/9ebcf406-5555-4c22-ae85-9cf314f4a04f-removebg-preview.png";

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

    // Check all required fields
    if (
      !formData.shopName.trim() ||
      !formData.ownerName.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
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
      navigate("/otp");
    } catch (error: any) {
      toast.error(error.message || "Registration error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#001F3F] rounded-2xl flex items-center justify-center">
            <img src={LOGO_ICON} alt="Daworks" className="w-10 h-10 object-contain" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
          Create your store
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm">
          It's free and quick.
        </p>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-3">
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

          {/* Main Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              PHONE NUMBER
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-3 text-gray-400" size={18} />
              <Input
                type="tel"
                name="phone"
                placeholder="+237 6XX XXX XXX"
                value={formData.phone}
                onChange={handleChange}
                className="pl-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
          </div>

          {/* Payment Accounts */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-3">Payment accounts:</p>

            {/* Orange Money */}
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
                  className="pl-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
                <span className="absolute right-3 top-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Orange
                </span>
              </div>
            </div>

            {/* MTN Momo */}
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
                  className="pl-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
                <span className="absolute right-3 top-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                  MTN
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-600 mt-2 flex items-start gap-2">
              <span>ℹ️</span>
              <span>At least one payment account is required to receive customer payments.</span>
            </p>
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

          {/* Password Section */}
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Security:</h3>

            {/* Password */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 text-gray-400" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 text-gray-400" size={18} />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
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

          {/* Create Account Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mt-6"
          >
            {isLoading ? "Creating..." : "Create account"}
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#0066FF] hover:text-[#0052CC] font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
