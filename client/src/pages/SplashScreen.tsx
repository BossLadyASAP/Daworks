import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const LOGO_ICON = "/manus-storage/9ebcf406-5555-4c22-ae85-9cf314f4a04f-removebg-preview_749438b6.png";

export default function SplashScreen() {
  const [, navigate] = useLocation();
  const { data: user, isLoading } = trpc.auth.me.useQuery();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (user) {
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="w-full h-screen bg-[#001F3F] flex flex-col items-center justify-center relative">
      {/* Logo */}
      <div className="mb-12">
        <img src={LOGO_ICON} alt="Daworks" className="w-24 h-24 object-contain" />
      </div>

      {/* Tagline */}
      <p className="text-white text-opacity-90 text-xl font-medium">
        Manage. Sell. Collect.
      </p>

      {/* Footer - Powered by */}
      <div className="absolute bottom-8 text-white text-opacity-60 text-sm">
        POWERED BY PawaPay
      </div>
    </div>
  );
}
