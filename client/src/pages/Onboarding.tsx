import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Check, QrCode, Package, TrendingUp } from "lucide-react";

const steps = [
  {
    title: "Scan. It's added.",
    description: "Scan your product barcode. Price and stock added automatically.",
    icon: <QrCode className="w-16 h-16 text-[#001F3F]" />,
  },
  {
    title: "Share. They pay.",
    description: "Generate your store QR code. Your customers scan and pay in 30 seconds.",
    icon: <QrCode className="w-16 h-16 text-[#001F3F]" />,
  },
  {
    title: "Manage. Sell. Collect.",
    description: "Track your sales in real-time and manage your stock easily.",
    icon: <TrendingUp className="w-16 h-16 text-[#001F3F]" />,
  },
];

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 relative">
          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="absolute top-8 right-8 text-[#0066FF] hover:text-[#0052CC] font-semibold text-sm"
          >
            Skip
          </button>

          {/* Progress Dots */}
          <div className="flex gap-2 mb-12 justify-center mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition ${
                  index === currentStep ? "bg-[#0066FF] w-8" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center">
              {step.icon}
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {step.title}
            </h1>
            <p className="text-gray-600 leading-relaxed">{step.description}</p>
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            className="w-full bg-[#001F3F] hover:bg-[#000F2F] text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Check size={20} />
                Get Started
              </>
            ) : (
              <>
                Next
                <ChevronRight size={20} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
