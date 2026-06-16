import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, User, Plus, ShoppingBag, AlertTriangle, Home, Package, ShoppingCart, FileText, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { data: user } = trpc.auth.me.useQuery();
  const { data: products } = trpc.products.list.useQuery();
  const { data: orders } = trpc.orders.list.useQuery();
  const { data: transactions } = trpc.transactions.list.useQuery();
  const [stats, setStats] = useState({ todaySales: 0, lowStock: 0, healthScore: 0 });

  useEffect(() => {
    if (orders && products) {
      const today = new Date().toDateString();
      const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
      const todaySales = todayOrders.length;
      const lowStockProducts = products.filter((p) => parseInt(p.stock as unknown as string) < 5).length;
      
      // Calculate health score (0-100)
      const totalProducts = products.length;
      const totalOrders = orders.length;
      const avgStock = products.reduce((sum, p) => sum + parseInt(p.stock as unknown as string), 0) / (totalProducts || 1);
      const healthScore = Math.min(100, Math.round((avgStock / 10 + (totalOrders > 0 ? 50 : 0)) / 1.5));

      setStats({
        todaySales,
        lowStock: lowStockProducts,
        healthScore,
      });
    }
  }, [orders, products]);

  const totalRevenue = transactions?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
  const mtnRevenue = transactions?.filter((t) => t.operator === "mtn").reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
  const orangeRevenue = transactions?.filter((t) => t.operator === "orange").reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
  const mtnCount = transactions?.filter((t) => t.operator === "mtn").length || 0;
  const orangeCount = transactions?.filter((t) => t.operator === "orange").length || 0;

  const recentTransactions = transactions?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 p-4 md:hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bienvenue, {user?.ownerName || "User"} 👋
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold"
            >
              {user?.ownerName?.charAt(0) || "U"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        {/* Revenue Card - Mobile */}
        <Card className="bg-gradient-to-br from-[#001F3F] to-[#0066FF] text-white p-6 rounded-2xl mb-6 md:hidden">
          <p className="text-sm text-blue-200 mb-2">REVENUS AUJOURD'HUI</p>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold">{totalRevenue.toLocaleString()}</span>
            <span className="text-xl">XAF</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-sm">
                  M
                </div>
                <span className="font-medium">MTN MoMo</span>
              </div>
              <div className="text-right">
                <p className="font-bold">{mtnRevenue.toLocaleString()} XAF</p>
                <p className="text-xs text-blue-200">{mtnCount} ventes</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-bold text-sm text-white">
                  O
                </div>
                <span className="font-medium">Orange Money</span>
              </div>
              <div className="text-right">
                <p className="font-bold">{orangeRevenue.toLocaleString()} XAF</p>
                <p className="text-xs text-blue-200">{orangeCount} ventes</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid - Mobile */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:hidden">
          <Card className="p-4 bg-white border border-gray-200 rounded-lg text-center">
            <ShoppingBag size={32} className="mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.todaySales}</p>
            <p className="text-sm text-gray-600">Ventes aujourd'hui</p>
          </Card>

          <Card className="p-4 bg-white border border-gray-200 rounded-lg text-center">
            <AlertTriangle size={32} className="mx-auto text-red-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
            <p className="text-sm text-gray-600">Stock bas</p>
          </Card>
        </div>

        {/* Add Sale Button - Mobile */}
        <div className="mb-6 md:hidden">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">ENREGISTREZ UNE NOUVELLE VENTE</p>
          <Button
            onClick={() => navigate("/catalogue")}
            className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Nouvelle Vente
          </Button>
        </div>

        {/* Health Score - Mobile */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg mb-6 md:hidden">
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray={`${(stats.healthScore / 100) * 283} 283`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{stats.healthScore}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-green-600 font-semibold">Score Santé {stats.healthScore} — Bon</p>
              <p className="text-sm text-gray-600">Boutique performante</p>
              <a href="#" className="text-sm text-[#0066FF] font-semibold mt-2 inline-block">
                Voir détail →
              </a>
            </div>
          </div>
        </Card>

        {/* Recent Transactions - Mobile */}
        <div className="md:hidden">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Transactions récentes</h2>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune transaction</p>
            ) : (
              recentTransactions.map((transaction, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      <ShoppingBag size={20} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Produit</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-bold rounded ${
                          transaction.operator === "mtn"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-orange-100 text-orange-800"
                        }`}>
                          {transaction.operator === "mtn" ? "MTN" : "OM"}
                        </span>
                        <span className="text-xs text-gray-600">
                          {new Date(transaction.createdAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">{parseFloat(transaction.amount).toLocaleString()} XAF</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Bienvenue, {user?.ownerName || "User"} 👋
                </h1>
                <p className="text-gray-600 mt-2">{user?.shopName || "Your Store"}</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-3 hover:bg-gray-100 rounded-lg relative">
                  <Bell size={24} className="text-gray-600" />
                  <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg"
                >
                  {user?.ownerName?.charAt(0) || "U"}
                </button>
              </div>
            </div>

            {/* Revenue Card */}
            <Card className="bg-gradient-to-br from-[#001F3F] to-[#0066FF] text-white p-8 rounded-2xl">
              <p className="text-sm text-blue-200 mb-3">REVENUS AUJOURD'HUI</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-bold">{totalRevenue.toLocaleString()}</span>
                <span className="text-2xl">XAF</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-bold">
                    M
                  </div>
                  <div>
                    <p className="font-medium">MTN MoMo</p>
                    <p className="text-2xl font-bold">{mtnRevenue.toLocaleString()} XAF</p>
                    <p className="text-xs text-blue-200">{mtnCount} ventes</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white">
                    O
                  </div>
                  <div>
                    <p className="font-medium">Orange Money</p>
                    <p className="text-2xl font-bold">{orangeRevenue.toLocaleString()} XAF</p>
                    <p className="text-xs text-blue-200">{orangeCount} ventes</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 bg-white border border-gray-200 rounded-lg">
                <ShoppingBag size={32} className="text-blue-600 mb-3" />
                <p className="text-3xl font-bold text-gray-900">{stats.todaySales}</p>
                <p className="text-gray-600 mt-2">Ventes aujourd'hui</p>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 rounded-lg">
                <AlertTriangle size={32} className="text-red-600 mb-3" />
                <p className="text-3xl font-bold text-gray-900">{stats.lowStock}</p>
                <p className="text-gray-600 mt-2">Stock bas</p>
              </Card>
            </div>

            {/* Add Sale Button */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-4">ENREGISTREZ UNE NOUVELLE VENTE</p>
              <Button
                onClick={() => navigate("/catalogue")}
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Nouvelle Vente
              </Button>
            </div>

            {/* Recent Transactions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Transactions récentes</h2>
              <div className="space-y-3">
                {recentTransactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucune transaction</p>
                ) : (
                  recentTransactions.map((transaction, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <ShoppingBag size={24} className="text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Produit</p>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-xs font-bold rounded ${
                              transaction.operator === "mtn"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-orange-100 text-orange-800"
                            }`}>
                              {transaction.operator === "mtn" ? "MTN" : "OM"}
                            </span>
                            <span className="text-xs text-gray-600">
                              {new Date(transaction.createdAt).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900">{parseFloat(transaction.amount).toLocaleString()} XAF</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Health Score */}
          <div className="space-y-6">
            <Card className="p-8 bg-white border border-gray-200 rounded-lg sticky top-6">
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray={`${(stats.healthScore / 100) * 283} 283`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{stats.healthScore}</span>
                  </div>
                </div>
                <p className="text-lg font-semibold text-green-600">Score Santé — Bon</p>
                <p className="text-sm text-gray-600 mt-1">Boutique performante</p>
                <a href="#" className="text-sm text-[#0066FF] font-semibold mt-3 inline-block hover:underline">
                  Voir détail →
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 flex flex-col items-center justify-center py-3 text-[#0066FF] border-t-2 border-[#0066FF]"
          >
            <Home size={24} />
            <span className="text-xs mt-1">Accueil</span>
          </button>
          <button
            onClick={() => navigate("/stock")}
            className="flex-1 flex flex-col items-center justify-center py-3 text-gray-600 hover:text-gray-900"
          >
            <Package size={24} />
            <span className="text-xs mt-1">Stock</span>
          </button>
          <button
            onClick={() => navigate("/catalogue")}
            className="flex-1 flex flex-col items-center justify-center py-3 text-gray-600 hover:text-gray-900"
          >
            <ShoppingCart size={24} />
            <span className="text-xs mt-1">Ventes</span>
          </button>
          <button
            onClick={() => navigate("/reports")}
            className="flex-1 flex flex-col items-center justify-center py-3 text-gray-600 hover:text-gray-900"
          >
            <FileText size={24} />
            <span className="text-xs mt-1">Factures</span>
          </button>
          <button className="flex-1 flex flex-col items-center justify-center py-3 text-gray-600 hover:text-gray-900">
            <MoreHorizontal size={24} />
            <span className="text-xs mt-1">Plus</span>
          </button>
        </div>
      </div>
    </div>
  );
}
