
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Supplier {
  id: string;
  name: string;
  category: string;
  status: "active" | "inactive" | "pending";
  performance: "excellent" | "good" | "average" | "poor";
  lastOrder: string;
}

interface SupplierListProps {
  suppliers: Supplier[];
  className?: string;
}

export function SupplierList({ suppliers, className }: SupplierListProps) {
  return (
    <div className={cn("dashboard-card", className)}>
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-800">Suppliers</h3>
        <button className="text-sm text-procurpal-primary hover:underline">
          View all
        </button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.category}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      supplier.status === "active" && "border-green-500 text-green-700 bg-green-50",
                      supplier.status === "inactive" && "border-gray-500 text-gray-700 bg-gray-50",
                      supplier.status === "pending" && "border-yellow-500 text-yellow-700 bg-yellow-50"
                    )}
                  >
                    {supplier.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mr-2",
                        supplier.performance === "excellent" && "bg-procurpal-success",
                        supplier.performance === "good" && "bg-green-500",
                        supplier.performance === "average" && "bg-yellow-500",
                        supplier.performance === "poor" && "bg-red-500"
                      )}
                    />
                    <span className="capitalize">{supplier.performance}</span>
                  </div>
                </TableCell>
                <TableCell>{supplier.lastOrder}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>View Orders</DropdownMenuItem>
                      <DropdownMenuItem>Edit Supplier</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
