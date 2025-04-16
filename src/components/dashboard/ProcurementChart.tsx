
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dailyData = [
  { name: "Mon", purchases: 20, requisitions: 15, savings: 5 },
  { name: "Tue", purchases: 25, requisitions: 18, savings: 7 },
  { name: "Wed", purchases: 30, requisitions: 20, savings: 8 },
  { name: "Thu", purchases: 22, requisitions: 16, savings: 6 },
  { name: "Fri", purchases: 28, requisitions: 21, savings: 9 },
  { name: "Sat", purchases: 15, requisitions: 10, savings: 4 },
  { name: "Sun", purchases: 10, requisitions: 8, savings: 3 },
];

const weeklyData = [
  { name: "Week 1", purchases: 120, requisitions: 90, savings: 30 },
  { name: "Week 2", purchases: 150, requisitions: 110, savings: 40 },
  { name: "Week 3", purchases: 140, requisitions: 100, savings: 35 },
  { name: "Week 4", purchases: 160, requisitions: 120, savings: 45 },
];

const monthlyData = [
  { name: "Jan", purchases: 450, requisitions: 350, savings: 100 },
  { name: "Feb", purchases: 500, requisitions: 380, savings: 120 },
  { name: "Mar", purchases: 480, requisitions: 360, savings: 110 },
  { name: "Apr", purchases: 520, requisitions: 400, savings: 130 },
  { name: "May", purchases: 540, requisitions: 420, savings: 135 },
  { name: "Jun", purchases: 560, requisitions: 430, savings: 140 },
];

export function ProcurementChart() {
  const [period, setPeriod] = useState("monthly");
  
  const data = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData,
  }[period as "daily" | "weekly" | "monthly"];

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Procurement Analysis</CardTitle>
          <CardDescription>
            Overview of procurement activities
          </CardDescription>
        </div>
        <Select
          defaultValue="monthly"
          onValueChange={(value) => setPeriod(value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`₹${value}`, ""]} 
                labelStyle={{ color: "#374151" }}
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem", 
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" 
                }}
              />
              <Legend />
              <Bar
                dataKey="purchases"
                name="Purchases"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="requisitions"
                name="Requisitions"
                fill="#6366F1"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="savings"
                name="Savings"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
