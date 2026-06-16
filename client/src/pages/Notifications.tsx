import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Bell, Trash2, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Notifications() {
  const { user } = useAuth();
  
  // Use public query for unauthenticated users, protected for authenticated
  const { data: notifications, refetch, isLoading } = user 
    ? trpc.notifications.list.useQuery()
    : trpc.notifications.listPublic.useQuery();
    
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const handleMarkAsRead = async (id: number) => {
    if (!user) {
      toast.error("Please sign in to mark notifications as read");
      return;
    }
    
    try {
      await markAsReadMutation.mutateAsync({ id });
      refetch();
      toast.success("Marked as read");
    } catch (error: any) {
      toast.error(error.message || "Failed to mark as read");
    }
  };

  const filteredNotifications = (notifications || []).filter((n) =>
    filter === "unread" ? !n.read : true
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-600" size={20} />;
      case "error":
        return <AlertCircle className="text-red-600" size={20} />;
      default:
        return <Info className="text-blue-600" size={20} />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with your store activity</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === f
                ? "bg-[#0066FF] text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="p-12 text-center bg-white border border-gray-200">
            <div className="animate-pulse">
              <p className="text-gray-500 text-lg">Loading notifications...</p>
            </div>
          </Card>
        ) : filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center bg-white border border-gray-200">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No notifications</p>
            {!user && (
              <p className="text-sm text-gray-400 mt-2">Sign in to see your notifications</p>
            )}
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-6 bg-white border border-gray-200 hover:shadow-md transition ${
                !notification.read ? "border-l-4 border-l-[#0066FF]" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{notification.message}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  {!notification.read && user && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
