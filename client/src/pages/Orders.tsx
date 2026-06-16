import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Eye } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: orders, isLoading } = trpc.orders.list.useQuery();

  const filteredOrders = (orders || []).filter((order) => {
    const phone = order.customerPhone || '';
    const matchesSearch = phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066FF] mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">Manage your customer orders</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search by phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-3 border border-gray-200 rounded-lg"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Orders Table */}
      <Card className="p-6 bg-white border border-gray-200 rounded-lg overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Order ID</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Method</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">#{order.id}</td>
                  <td className="py-4 px-4 text-gray-600">{order.customerPhone || 'N/A'}</td>
                  <td className="py-4 px-4 font-semibold text-gray-900">
                    {parseFloat(order.totalAmount).toLocaleString()} XAF
                  </td>
                  <td className="py-4 px-4 text-gray-600 capitalize">{order.paymentMethod}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="py-4 px-4">
                    <Button variant="ghost" className="text-[#0066FF] p-2">
                      <Eye size={20} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
