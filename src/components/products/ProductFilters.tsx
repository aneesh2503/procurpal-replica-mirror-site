
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  supplier: string;
  status: string;
  lastUpdated: string;
}

interface ProductFiltersProps {
  onFilter: (filters: any) => void;
  products: Product[];
}

export function ProductFilters({ onFilter, products }: ProductFiltersProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [supplier, setSupplier] = useState("all");
  
  // Extract unique categories
  const categories = ["all", ...new Set(products.map(product => product.category))];
  
  // Extract unique suppliers
  const suppliers = ["all", ...new Set(products.map(product => product.supplier))];
  
  // Apply filters whenever they change
  useEffect(() => {
    onFilter({
      search,
      category,
      status,
      supplier
    });
  }, [search, category, status, supplier, onFilter]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="relative">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>
      
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="in-stock">In Stock</SelectItem>
          <SelectItem value="low-stock">Low Stock</SelectItem>
          <SelectItem value="out-of-stock">Out of Stock</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={supplier} onValueChange={setSupplier}>
        <SelectTrigger>
          <SelectValue placeholder="Supplier" />
        </SelectTrigger>
        <SelectContent>
          {suppliers.map((sup) => (
            <SelectItem key={sup} value={sup}>
              {sup === "all" ? "All Suppliers" : sup}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
