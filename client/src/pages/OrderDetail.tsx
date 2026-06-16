import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";

export default function OrderDetail() {
  const [, navigate] = useLocation();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate("/orders")}
        className="flex items-center gap-2 text-[#0066FF] mb-8 hover:underline"
      >
        <ArrowLeft size={20} />
        Back to Orders
      </button>

      <div className="max-w-2xl">
        {/* Order Header */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #12345</h1>
              <p className="text-gray-600">June 16, 2026 at 2:30 PM</p>
            </div>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
              Completed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Customer Phone</p>
              <p className="font-semibold text-gray-900">+237 6XX XXX XXX</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Payment Method</p>
              <p className="font-semibold text-gray-900">MTN Mobile Money</p>
            </div>
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
                <div className="flex items-center gap-4">
                  <Package size={40} className="text-gray-300" />
                  <div>
                    <p className="font-semibold text-gray-900">Product Name</p>
                    <p className="text-sm text-gray-600">Qty: 2</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">10,000 XAF</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Order Summary */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>20,000 XAF</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>0 XAF</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-[#0066FF]">20,000 XAF</span>
            </div>
          </div>

          <Button
            onClick={() => navigate("/orders")}
            className="w-full mt-6 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3 rounded-lg transition"
          >
            Back to Orders
          </Button>
        </Card>
      </div>
    </div>
  );
}
