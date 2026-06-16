import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Plus, Minus, Search, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Stock() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: products, isLoading } = trpc.products.listPublic.useQuery();
  const updateStockMutation = trpc.products.updateStock.useMutation();

  const filteredProducts = (products || []).filter((p) => {
    const productName = typeof p.name === 'string' ? p.name : '';
    return productName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleUpdateStock = async (productId: number, newStock: string) => {
    toast.info("Stock updates are available for authenticated users only");
  };

  const lowStockProducts = (products || []).filter((p) => {
    const stock = typeof p.stock === 'string' ? parseInt(p.stock) : (p.stock as unknown as number);
    return stock < 5;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066FF] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Stock Management</h1>
        <p className="text-gray-600">View your product inventory (Demo Mode)</p>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="p-4 bg-red-50 border border-red-200 mb-6 flex items-start gap-4">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-red-900">Low Stock Alert</h3>
            <p className="text-red-700 text-sm">
              {lowStockProducts.length} product(s) have low stock levels
            </p>
          </div>
        </Card>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-3 border border-gray-200 rounded-lg"
          />
        </div>
      </div>

      {/* Products Table */}
      <Card className="p-6 bg-white border border-gray-200 rounded-lg overflow-x-auto">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Product</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Category</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Stock</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Price</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stock = parseInt(product.stock as unknown as string);
                const isLowStock = stock < 5;

                return (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package size={20} className="text-gray-400" />
                        </div>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{product.category || 'N/A'}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isLowStock
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {stock} units
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-900 font-medium">
                      {parseFloat(product.salePrice).toLocaleString()} XAF
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStock(product.id, (stock - 1).toString())}
                          className="p-1 hover:bg-gray-200 rounded-lg text-gray-600 opacity-50 cursor-not-allowed"
                          disabled
                        >
                          <Minus size={18} />
                        </button>
                        <span className="w-12 text-center font-medium">{stock}</span>
                        <button
                          onClick={() => handleUpdateStock(product.id, (stock + 1).toString())}
                          className="p-1 hover:bg-gray-200 rounded-lg text-gray-600 opacity-50 cursor-not-allowed"
                          disabled
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
