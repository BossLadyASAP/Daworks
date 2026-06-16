import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, QrCode } from "lucide-react";
import { toast } from "sonner";

export default function Share() {
  const shareUrl = window.location.origin;
  const referralCode = "DAWORKS2024";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Share & Referral</h1>
        <p className="text-gray-600">Share your store and earn rewards</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Share Link */}
        <Card className="p-8 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Share2 size={24} className="text-[#0066FF]" />
            Share Your Store
          </h2>
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg bg-gray-50"
            />
            <Button
              onClick={handleCopyLink}
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white flex items-center gap-2"
            >
              <Copy size={20} />
              Copy
            </Button>
          </div>
        </Card>

        {/* Referral Code */}
        <Card className="p-8 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Referral Code</h2>
          <div className="flex gap-2">
            <Input
              value={referralCode}
              readOnly
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg bg-gray-50 text-center font-bold text-xl"
            />
            <Button
              onClick={handleCopyCode}
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white flex items-center gap-2"
            >
              <Copy size={20} />
              Copy
            </Button>
          </div>
        </Card>

        {/* QR Code */}
        <Card className="p-8 bg-white border border-gray-200 rounded-lg text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <QrCode size={24} className="text-[#0066FF]" />
            QR Code
          </h2>
          <div className="w-40 h-40 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
            <QrCode size={80} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-600 mt-4">Scan to share your store</p>
        </Card>

        {/* Social Share */}
        <Card className="p-8 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Share on Social Media</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Facebook</Button>
            <Button className="bg-sky-400 hover:bg-sky-500 text-white">Twitter</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">WhatsApp</Button>
            <Button className="bg-pink-600 hover:bg-pink-700 text-white">Instagram</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
