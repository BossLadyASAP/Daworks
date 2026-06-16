import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Store, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  
  // Use public query for unauthenticated users, protected for authenticated
  const { data: profileData, isLoading } = user 
    ? trpc.profile.get.useQuery()
    : trpc.profile.getPublic.useQuery();
    
  const updateProfileMutation = trpc.profile.update.useMutation();

  const [formData, setFormData] = useState({
    shopName: profileData?.shopName || "",
    ownerName: profileData?.ownerName || "",
    email: profileData?.email || "",
    phone: profileData?.phone || "",
    orangePhone: profileData?.orangePhone || "",
    mtnPhone: profileData?.mtnPhone || "",
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        shopName: profileData.shopName || "",
        ownerName: profileData.ownerName || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        orangePhone: profileData.orangePhone || "",
        mtnPhone: profileData.mtnPhone || "",
      });
    }
  }, [profileData]);

  const handleSave = async () => {
    if (!user) {
      toast.error("Please sign in to update your profile");
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        shopName: formData.shopName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        orangePhone: formData.orangePhone,
        mtnPhone: formData.mtnPhone,
      });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>
        <div className="max-w-2xl">
          <Card className="p-8 bg-white border border-gray-200 rounded-lg">
            <div className="animate-pulse">
              <p className="text-gray-500">Loading profile...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="max-w-2xl">
        <Card className="p-8 bg-white border border-gray-200 rounded-lg">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-full flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{profileData?.ownerName || "Guest"}</p>
              <p className="text-gray-600">{profileData?.email || "Not signed in"}</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Shop Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Store size={16} className="inline mr-2" />
                Shop Name
              </label>
              <Input
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                disabled={!user}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] disabled:bg-gray-100 disabled:text-gray-600"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User size={16} className="inline mr-2" />
                Owner Name
              </label>
              <Input
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                disabled={!user}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] disabled:bg-gray-100 disabled:text-gray-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              <Input
                value={formData.email}
                disabled
                className="w-full py-2 px-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Phone size={16} className="inline mr-2" />
                Primary Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!user}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] disabled:bg-gray-100 disabled:text-gray-600"
              />
            </div>

            {/* Orange Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Orange Money Phone
              </label>
              <Input
                value={formData.orangePhone}
                onChange={(e) => setFormData({ ...formData, orangePhone: e.target.value })}
                disabled={!user}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] disabled:bg-gray-100 disabled:text-gray-600"
              />
            </div>

            {/* MTN Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                MTN Mobile Money Phone
              </label>
              <Input
                value={formData.mtnPhone}
                onChange={(e) => setFormData({ ...formData, mtnPhone: e.target.value })}
                disabled={!user}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] disabled:bg-gray-100 disabled:text-gray-600"
              />
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={!user}
              className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {user ? "Save Changes" : "Sign in to edit"}
            </Button>

            {!user && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Sign in to view and edit your profile information.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
