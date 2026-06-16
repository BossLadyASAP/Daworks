import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const LOGO_ICON = "/9ebcf406-5555-4c22-ae85-9cf314f4a04f-removebg-preview.png";

export default function OTP() {
  const [, navigate] = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(59);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      toast.error("Please enter a valid OTP code");
      return;
    }

    setIsVerifying(true);
    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsVerified(true);
      toast.success("OTP verified successfully!");
      setTimeout(() => {
        navigate("/onboarding");
      }, 2000);
    } catch (error: any) {
      toast.error("Invalid OTP code");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 relative">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#001F3F] rounded-2xl flex items-center justify-center">
              <img src={LOGO_ICON} alt="Daworks" className="w-10 h-10 object-contain" />
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate("/login")}
            className="absolute top-8 left-8 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>

          {!isVerified ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification</h1>
              <p className="text-gray-600 mb-8">
                Code sent to +237 671 234 567
              </p>

              {/* OTP Input Fields */}
              <div className="flex gap-3 mb-6 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none focus:border-[#0066FF]"
                  />
                ))}
              </div>

              {/* Resend Timer */}
              <p className="text-center text-gray-600 text-sm mb-6">
                Resend code in{" "}
                <span className="text-[#0066FF] font-semibold">
                  00:{timeLeft.toString().padStart(2, "0")}
                </span>
              </p>

              {/* Verify Button */}
              <Button
                onClick={handleVerifyOTP}
                disabled={isVerifying || otp.join("").length < 6}
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>

              {/* Footer */}
              <p className="text-center text-gray-500 text-xs mt-8">
                SECURED BY STORE 237
              </p>
            </>
          ) : (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verified!</h2>
              <p className="text-gray-600">Redirecting to onboarding...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
