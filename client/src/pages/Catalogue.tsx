import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Plus, Minus, X } from "lucide-react";
import { toast } from "sonner";

export default function Catalogue() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { items: cart, addItem, removeItem, updateQuantity, total } = useCart();
  const [showCart, setShowCart] = useState(false);
  const { data: products, isLoading } = trpc.products.listPublic.useQuery();

  const filteredProducts = (products || []).filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: any) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.salePrice),
      quantity: 1,
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    navigate("/payment");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066FF] mx-auto mb-4"></div>
          <p>Loading catalogue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Cart */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Catalogue</h1>
          <p className="text-gray-600">Browse and manage your products</p>
        </div>
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <ShoppingCart size={24} className="text-[#0066FF]" />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Grid */}
        <div className="lg:col-span-2">
          {filteredProducts.length === 0 ? (
            <Card className="p-12 text-center bg-white border border-gray-200 rounded-lg">
              <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No products found</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition">
                  <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <ShoppingCart size={48} className="text-gray-300" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Sale Price</p>
                      <p className="text-2xl font-bold text-[#0066FF]">
                        {parseFloat(product.salePrice).toLocaleString()} XAF
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Stock</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {product.stock}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => addToCart(product)}
                    disabled={parseInt(product.stock as unknown as string) === 0}
                    className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                  >
                    <Plus size={20} className="mr-2" />
                    Add to Cart
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <div>
          <Card className="p-6 bg-white border border-gray-200 rounded-lg sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Shopping Cart</h2>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.price.toLocaleString()} XAF × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-6 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-1 hover:bg-red-100 rounded ml-2"
                        >
                          <X size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Total:</span>
                    <span className="text-[#0066FF]">{total.toLocaleString()} XAF</span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3 rounded-lg transition mb-2"
                  >
                    Proceed to Payment
                  </Button>
                  <Button
                    onClick={() => setShowCart(false)}
                    variant="outline"
                    className="w-full py-3 rounded-lg border border-gray-300"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
