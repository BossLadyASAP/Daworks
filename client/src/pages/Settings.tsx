import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { LogOut, Globe, Bell, Lock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

export default function Settings() {
  const [, navigate] = useLocation();
  const [language, setLanguage] = useState("en");
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Logout failed");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Language */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Globe className="text-[#0066FF]" size={24} />
              <div>
                <p className="font-semibold text-gray-900">Language</p>
                <p className="text-sm text-gray-600">Choose your preferred language</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Bell className="text-[#0066FF]" size={24} />
              <div>
                <p className="font-semibold text-gray-900">Notifications</p>
                <p className="text-sm text-gray-600">Manage notification preferences</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Lock className="text-[#0066FF]" size={24} />
              <div>
                <p className="font-semibold text-gray-900">Security</p>
                <p className="text-sm text-gray-600">Change password and security settings</p>
              </div>
            </div>
            <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white">
              Manage
            </Button>
          </div>
        </Card>

        {/* Logout */}
        <Card className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LogOut className="text-red-600" size={24} />
              <div>
                <p className="font-semibold text-gray-900">Logout</p>
                <p className="text-sm text-gray-600">Sign out from your account</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
