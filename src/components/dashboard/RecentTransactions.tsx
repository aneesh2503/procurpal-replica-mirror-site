
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "processing";
  supplier: string;
  date: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  className?: string;
}

export function RecentTransactions({
  transactions,
  className,
}: RecentTransactionsProps) {
  return (
    <div className={cn("dashboard-card", className)}>
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-800">Recent Transactions</h3>
        <button className="text-sm text-procurpal-primary hover:underline">
          View all
        </button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {transaction.reference}
                </TableCell>
                <TableCell>{transaction.supplier}</TableCell>
                <TableCell>₹{transaction.amount.toLocaleString()}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      transaction.status === "pending" && "border-yellow-500 text-yellow-700 bg-yellow-50",
                      transaction.status === "completed" && "border-green-500 text-green-700 bg-green-50",
                      transaction.status === "failed" && "border-red-500 text-red-700 bg-red-50",
                      transaction.status === "processing" && "border-blue-500 text-blue-700 bg-blue-50"
                    )}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
