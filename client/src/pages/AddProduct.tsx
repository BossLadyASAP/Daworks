import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";

export default function AddProduct() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    costPrice: "",
    salePrice: "",
    stock: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createProductMutation = trpc.products.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.salePrice || !formData.costPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProductMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        costPrice: formData.costPrice,
        salePrice: formData.salePrice,
        stock: parseInt(formData.stock) || 0,
      });
      toast.success("Product added successfully!");
      navigate("/catalogue");
    } catch (error: any) {
      toast.error(error.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/catalogue")}
          className="flex items-center gap-2 text-[#0066FF] mb-8 hover:underline"
        >
          <ArrowLeft size={20} />
          Back to Catalogue
        </button>

        <Card className="p-8 bg-white border border-gray-200 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                className="w-full py-2 px-4 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter product description"
                rows={4}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <Input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Electronics"
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cost Price (XAF) *
                </label>
                <Input
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  placeholder="0"
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sale Price (XAF) *
                </label>
                <Input
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  placeholder="0"
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-600">Drag and drop image or click to upload</p>
              <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => navigate("/catalogue")}
                variant="outline"
                className="flex-1 py-3 rounded-lg border border-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
