import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Package } from "lucide-react";

export default function Products() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    costPrice: "",
    salePrice: "",
    stock: "0",
  });

  const { data: products, refetch } = trpc.products.list.useQuery();
  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success("Product created!");
      setFormData({
        name: "",
        description: "",
        category: "",
        costPrice: "",
        salePrice: "",
        stock: "0",
      });
      setIsOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product");
    },
  });

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success("Product deleted!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.costPrice || !formData.salePrice) {
      toast.error("Please fill in required fields");
      return;
    }
    await createMutation.mutateAsync({
      name: formData.name,
      description: formData.description,
      category: formData.category,
      costPrice: formData.costPrice,
      salePrice: formData.salePrice,
      stock: parseInt(formData.stock),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#001F3F]">Products</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0066FF] hover:bg-[#0052CC]">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPrice">Cost Price *</Label>
                <Input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  value={formData.costPrice}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price *</Label>
                <Input
                  id="salePrice"
                  name="salePrice"
                  type="number"
                  value={formData.salePrice}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <Button type="submit" className="w-full bg-[#0066FF] hover:bg-[#0052CC]">
                Create Product
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="p-4">
              <h3 className="font-semibold text-lg text-[#001F3F]">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.salePrice} XAF</p>
              <p className="text-sm">Stock: {product.stock}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => deleteMutation.mutate({ id: product.id })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No products yet</p>
        </Card>
      )}
    </div>
  );
}
