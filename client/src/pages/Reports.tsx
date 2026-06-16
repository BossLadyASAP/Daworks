import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Package } from "lucide-react";
import { useState } from "react";

const COLORS = ["#0066FF", "#FF9500", "#FF6B35", "#6366F1"];

export default function Reports() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const { data: revenueData } = trpc.stats.revenueChartPublic.useQuery();
  const { data: topProducts } = trpc.stats.topProductsPublic.useQuery();
  const { data: stats } = trpc.stats.dashboardPublic.useQuery();
  const { data: orders } = trpc.orders.listPublic.useQuery();
  const { data: transactions } = trpc.transactions.listPublic.useQuery();

  const totalRevenue = stats?.totalRevenue || 0;
  const totalOrders = stats?.totalOrders || 0;
  const completedOrders = stats?.completedOrders || 0;
  const completionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0;

  // Calculate profit (revenue - costs)
  const totalCosts = (orders || [])
    .reduce((sum, order) => sum + parseFloat(order.totalAmount) * 0.3, 0); // Assume 30% cost
  const profit = totalRevenue - totalCosts;

  // Revenue by operator
  const revenueByOperator = (transactions || []).reduce((acc: any, tx) => {
    const operator = tx.operator as string;
    const amount = parseFloat(tx.amount);
    const existing = acc.find((item: any) => item.name === operator);
    if (existing) {
      existing.value += amount;
    } else {
      acc.push({ name: operator.toUpperCase(), value: amount });
    }
    return acc;
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Track your business performance (Demo Mode)</p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-8">
        {(["week", "month", "year"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === p
                ? "bg-[#0066FF] text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {totalRevenue.toLocaleString()} XAF
              </h3>
              <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                <TrendingUp size={16} /> +15% vs last period
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        {/* Profit */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Profit</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {profit.toLocaleString()} XAF
              </h3>
              <p className="text-blue-600 text-sm mt-2">
                Margin: {totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        {/* Orders */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Orders</p>
              <h3 className="text-3xl font-bold text-gray-900">{totalOrders}</h3>
              <p className="text-purple-600 text-sm mt-2">
                Completion: {completionRate}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="text-purple-600" size={24} />
            </div>
          </div>
        </Card>

        {/* Average Order Value */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Avg Order Value</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {totalOrders > 0 ? (totalRevenue / totalOrders).toLocaleString() : 0} XAF
              </h3>
              <p className="text-orange-600 text-sm mt-2">
                {totalOrders} orders tracked
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-orange-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                formatter={(value) => `${value.toLocaleString()} XAF`}
              />
              <Legend />
              <Line type="monotone" dataKey="mtn" stroke="#FFB800" strokeWidth={2} />
              <Line type="monotone" dataKey="orange" stroke="#FF6B35" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue by Operator */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Operator</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByOperator}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toLocaleString()} XAF`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueByOperator.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toLocaleString()} XAF`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Products & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h2>
          <div className="space-y-4">
            {(topProducts || []).map((product, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#0066FF] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{product.sales} sales</p>
                  <p className="text-sm text-gray-600">
                    {((product.sales / ((topProducts?.[0]?.sales) || 1)) * 100).toFixed(0)}% of top
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Order Status Distribution */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h2>
          <div className="space-y-4">
            {[
              { status: "Completed", count: completedOrders, color: "bg-green-100", textColor: "text-green-700" },
              { status: "Pending", count: totalOrders - completedOrders, color: "bg-yellow-100", textColor: "text-yellow-700" },
            ].map((item) => (
              <div key={item.status}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{item.status}</p>
                  <p className={`font-semibold ${item.textColor}`}>{item.count}</p>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color}`}
                    style={{
                      width: `${totalOrders > 0 ? (item.count / totalOrders) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
