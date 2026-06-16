import { useEffect } from "react";
import { useLocation } from "wouter";

const LOGO_ICON = "/9ebcf406-5555-4c22-ae85-9cf314f4a04f-removebg-preview.png";

export default function SplashScreen() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001F3F] to-[#003366] flex items-center justify-center p-4 relative">
      <div className="text-center flex flex-col items-center">
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
    </div>
  );
}
