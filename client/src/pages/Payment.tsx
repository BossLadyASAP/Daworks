import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Payment() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"operator" | "details" | "success" | "failed">("operator");
  const [selectedOperator, setSelectedOperator] = useState<"mtn" | "orange" | null>(null);
  const [customerPhone, setCustomerPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const createOrderMutation = trpc.orders.create.useMutation();
  const createTransactionMutation = trpc.transactions.create.useMutation();

  // Get cart from localStorage
  const [cartItems, setCartItems] = useState<any[]>([]);
  
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    }
  }, []);

  const totalAmount = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  const handleSelectOperator = (operator: "mtn" | "orange") => {
    setSelectedOperator(operator);
    setStep("details");
  };

  const handleProcessPayment = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/catalogue");
      return;
    }

    if (!customerPhone) {
      toast.error("Please enter customer phone number");
      return;
    }

    if (!selectedOperator) {
      toast.error("Please select a payment operator");
      return;
    }

    setIsProcessing(true);
    try {
      // Create order
      const orderResult = await createOrderMutation.mutateAsync({
        customerPhone,
        totalAmount: totalAmount.toString(),
        paymentMethod: selectedOperator,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      // Extract order ID from result
      const orderId = typeof orderResult === 'object' && orderResult !== null && 'id' in orderResult 
        ? (orderResult as any).id 
        : undefined;

      // Create transaction
      if (orderId) {
        await createTransactionMutation.mutateAsync({
          amount: totalAmount.toString(),
          operator: selectedOperator,
          orderId,
        });
      }

      setStep("success");
      // Clear cart after successful payment
      localStorage.removeItem("cart");
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Payment error");
      setStep("failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success State */}
        {step === "success" && (
          <Card className="p-8 bg-white border border-gray-200 rounded-2xl text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment successful!</h1>
            <p className="text-gray-600 mb-2">Your order has been processed</p>
            <p className="text-2xl font-bold text-gray-900 mb-6">
              {totalAmount.toLocaleString()} XAF
            </p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </Card>
        )}

        {/* Failed State */}
        {step === "failed" && (
          <Card className="p-8 bg-white border border-gray-200 rounded-2xl text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="text-red-600" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment failed</h1>
            <p className="text-gray-600 mb-6">An error occurred. Please try again.</p>
            <Button
              onClick={() => setStep("operator")}
              className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3 rounded-lg"
            >
              Try again
            </Button>
          </Card>
        )}

        {/* Operator Selection */}
        {step === "operator" && (
          <Card className="p-8 bg-white border border-gray-200 rounded-2xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Select payment method</h1>
            <p className="text-gray-600 mb-8">Choose your payment operator</p>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <p className="text-sm text-gray-600 mb-2">Order total</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalAmount.toLocaleString()} XAF
              </p>
            </div>

            {/* Operator Options */}
            <div className="space-y-4 mb-8">
              {/* MTN */}
              <button
                onClick={() => handleSelectOperator("mtn")}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-black">
                    MTN
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">MTN Mobile Money</p>
                    <p className="text-sm text-gray-600">Pay via MTN Momo</p>
                  </div>
                </div>
              </button>

              {/* Orange */}
              <button
                onClick={() => handleSelectOperator("orange")}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white">
                    Orange
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Orange Money</p>
                    <p className="text-sm text-gray-600">Pay via Orange Money</p>
                  </div>
                </div>
              </button>
            </div>

            <Button
              onClick={() => navigate("/catalogue")}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to catalog
            </Button>
          </Card>
        )}

        {/* Payment Details */}
        {step === "details" && (
          <Card className="p-8 bg-white border border-gray-200 rounded-2xl">
            <button
              onClick={() => setStep("operator")}
              className="flex items-center text-[#0066FF] hover:text-[#0052CC] mb-6"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </button>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Détails du paiement</h1>
            <p className="text-gray-600 mb-8">
              Complétez votre paiement via {selectedOperator === "mtn" ? "MTN Mobile Money" : "Orange Money"}
            </p>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <div className="space-y-2 mb-4">
                {cartItems.map((item: any) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      {(item.price * item.quantity).toLocaleString()} XAF
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  {totalAmount.toLocaleString()} XAF
                </span>
              </div>
            </div>

            {/* Customer Phone */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                NUMÉRO DE TÉLÉPHONE DU CLIENT
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <Input
                  type="tel"
                  placeholder="Entrez le numéro du client"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="pl-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>
            </div>

            {/* Process Button */}
            <Button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {isProcessing ? "Traitement..." : `Payer ${totalAmount.toLocaleString()} XAF`}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
