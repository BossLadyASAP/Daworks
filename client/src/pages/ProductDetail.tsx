import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";

export default function ProductDetail() {
  const [, navigate] = useLocation();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate("/catalogue")}
        className="flex items-center gap-2 text-[#0066FF] mb-8 hover:underline"
      >
        <ArrowLeft size={20} />
        Back to Catalogue
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <Card className="p-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center h-96">
          <div className="text-center">
            <Package size={80} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Product Image</p>
          </div>
        </Card>

        {/* Product Info */}
        <Card className="p-8 bg-white border border-gray-200 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Name</h1>
          <p className="text-gray-600 mb-6">Category: Electronics</p>

          <div className="space-y-4 mb-8">
            <div>
              <p className="text-gray-600 text-sm">Sale Price</p>
              <p className="text-3xl font-bold text-[#0066FF]">5,000 XAF</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Cost Price</p>
              <p className="text-xl font-semibold text-gray-900">3,000 XAF</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Stock Available</p>
              <p className="text-xl font-semibold text-green-600">25 units</p>
            </div>
          </div>

          <p className="text-gray-600 mb-8">
            This is a detailed product description. Add more information about the product features, specifications, and benefits here.
          </p>

          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/catalogue")}
              variant="outline"
              className="flex-1 py-3 rounded-lg border border-gray-300"
            >
              Back
            </Button>
            <Button className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3 rounded-lg transition">
              Edit Product
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
