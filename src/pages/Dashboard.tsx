
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityItem } from "@/components/dashboard/ActivityItem";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SupplierList } from "@/components/dashboard/SupplierList";
import { ProcurementChart } from "@/components/dashboard/ProcurementChart";
import { 
  BarChart3, 
  Box, 
  DollarSign, 
  FileText, 
  Package, 
  ShoppingCart 
} from "lucide-react";

// Mock data
const activities = [
  {
    id: "1",
    title: "PO #12345 Approved",
    description: "Purchase order for Office Supplies was approved",
    time: "10 minutes ago",
    status: "approved" as const,
    user: {
      name: "Rajesh Kumar",
    },
  },
  {
    id: "2",
    title: "Quotation Request",
    description: "New quotation request for IT Equipment",
    time: "2 hours ago",
    status: "pending" as const,
    user: {
      name: "Priya Sharma",
    },
  },
  {
    id: "3",
    title: "Vendor Registration",
    description: "New vendor registered: Tech Solutions Ltd.",
    time: "Yesterday at 4:30 PM",
    user: {
      name: "Amit Patel",
    },
  },
  {
    id: "4",
    title: "Payment Processed",
    description: "Payment of ₹45,000 processed for Invoice #789",
    time: "Yesterday at 2:15 PM",
    status: "completed" as const,
    user: {
      name: "Neha Gupta",
    },
  },
];

const transactions = [
  {
    id: "1",
    reference: "PO-89754",
    amount: 25000,
    status: "completed" as const,
    supplier: "Office Depot",
    date: "Today at 10:30 AM",
  },
  {
    id: "2",
    reference: "PO-89753",
    amount: 34500,
    status: "pending" as const,
    supplier: "Tech Solutions",
    date: "Yesterday at 2:45 PM",
  },
  {
    id: "3",
    reference: "PO-89752",
    amount: 12750,
    status: "processing" as const,
    supplier: "Global Supplies",
    date: "Feb 18, 2024",
  },
  {
    id: "4",
    reference: "PO-89751",
    amount: 8900,
    status: "failed" as const,
    supplier: "Metro Furniture",
    date: "Feb 17, 2024",
  },
  {
    id: "5",
    reference: "PO-89750",
    amount: 67200,
    status: "completed" as const,
    supplier: "IT Networks",
    date: "Feb 15, 2024",
  },
];

const suppliers = [
  {
    id: "1",
    name: "Tech Solutions Ltd.",
    category: "IT Equipment",
    status: "active" as const,
    performance: "excellent" as const,
    lastOrder: "Today",
  },
  {
    id: "2",
    name: "Office Supplies Co.",
    category: "Stationery",
    status: "active" as const,
    performance: "good" as const,
    lastOrder: "Yesterday",
  },
  {
    id: "3",
    name: "Global Furniture Inc.",
    category: "Furniture",
    status: "inactive" as const,
    performance: "average" as const,
    lastOrder: "Feb 10, 2024",
  },
  {
    id: "4",
    name: "Metro Catering",
    category: "Food & Beverage",
    status: "pending" as const,
    performance: "poor" as const,
    lastOrder: "Never",
  },
  {
    id: "5",
    name: "Industrial Supplies",
    category: "Machinery",
    status: "active" as const,
    performance: "good" as const,
    lastOrder: "Feb 5, 2024",
  },
];

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            <div className="flex gap-3">
              <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-procurpal-primary/30 focus:border-procurpal-primary">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>
              <button className="bg-procurpal-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-procurpal-primary/90">
                Export
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Total Requisitions"
              value="342"
              icon={FileText}
              trend={{ value: "12%", isPositive: true }}
              iconClassName="bg-blue-50 text-blue-600"
            />
            <StatCard
              title="Active Purchases"
              value="147"
              icon={ShoppingCart}
              trend={{ value: "5%", isPositive: true }}
              iconClassName="bg-purple-50 text-purple-600"
            />
            <StatCard
              title="Total Inventory Items"
              value="2,845"
              icon={Package}
              trend={{ value: "3%", isPositive: true }}
              iconClassName="bg-orange-50 text-orange-600"
            />
            <StatCard
              title="Savings YTD"
              value="₹245,000"
              icon={DollarSign}
              trend={{ value: "8%", isPositive: true }}
              iconClassName="bg-green-50 text-green-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <ProcurementChart />
            </div>
            <div className="dashboard-card">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-800">Recent Activity</h3>
              </div>
              <div className="p-4">
                {activities.map((activity) => (
                  <ActivityItem key={activity.id} {...activity} />
                ))}
                <div className="mt-2 text-center">
                  <button className="text-sm text-procurpal-primary hover:underline">
                    View all activity
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentTransactions transactions={transactions} />
            <SupplierList suppliers={suppliers} />
          </div>
        </main>
      </div>
    </div>
  );
}
