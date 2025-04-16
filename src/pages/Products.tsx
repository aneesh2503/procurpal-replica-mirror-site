
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ProductList } from "@/components/products/ProductList";
import { ProductFilters } from "@/components/products/ProductFilters";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/sonner";

// Mock product data
const initialProducts = [
  {
    id: "1",
    name: "Office Chair - Ergonomic",
    category: "Furniture",
    price: 12500,
    stock: 45,
    supplier: "Office Comfort Solutions",
    status: "in-stock",
    lastUpdated: "2023-12-15",
    thumbnail: "/placeholder.svg"
  },
  {
    id: "2",
    name: "MacBook Pro 16\"",
    category: "Electronics",
    price: 225000,
    stock: 12,
    supplier: "Tech Solutions Ltd.",
    status: "low-stock",
    lastUpdated: "2024-01-22",
    thumbnail: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Multi-Function Printer",
    category: "Electronics",
    price: 85000,
    stock: 8,
    supplier: "Office Supplies Co.",
    status: "in-stock",
    lastUpdated: "2024-02-10",
    thumbnail: "/placeholder.svg"
  },
  {
    id: "4",
    name: "Paper A4 (Box of 5)",
    category: "Stationery",
    price: 2500,
    stock: 120,
    supplier: "Global Supplies",
    status: "in-stock",
    lastUpdated: "2024-03-05",
    thumbnail: "/placeholder.svg"
  },
  {
    id: "5",
    name: "Conference Table - Large",
    category: "Furniture",
    price: 45000,
    stock: 2,
    supplier: "Metro Furniture",
    status: "low-stock",
    lastUpdated: "2024-01-30",
    thumbnail: "/placeholder.svg"
  },
  {
    id: "6",
    name: "Wireless Mouse",
    category: "Electronics",
    price: 3500,
    stock: 0,
    supplier: "Tech Solutions Ltd.",
    status: "out-of-stock",
    lastUpdated: "2024-02-15",
    thumbnail: "/placeholder.svg"
  },
  {
    id: "7",
    name: "Whiteboard - Magnetic",
    category: "Office Equipment",
    price: 8500,
    stock: 15,
    supplier: "Office Depot",
    status: "in-stock",
    lastUpdated: "2024-03-01",
    thumbnail: "/placeholder.svg"
  },
  {
    id: "8",
    name: "Desk Lamp - LED",
    category: "Lighting",
    price: 2800,
    stock: 32,
    supplier: "Luminary Supplies",
    status: "in-stock",
    lastUpdated: "2024-02-20",
    thumbnail: "/placeholder.svg"
  }
];

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [filtered, setFiltered] = useState(initialProducts);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const { toast: alertToast } = useToast();

  const handleFilter = (filters: any) => {
    let results = [...products];
    
    if (filters.category && filters.category !== "all") {
      results = results.filter(product => product.category === filters.category);
    }
    
    if (filters.status && filters.status !== "all") {
      results = results.filter(product => product.status === filters.status);
    }
    
    if (filters.supplier && filters.supplier !== "all") {
      results = results.filter(product => product.supplier === filters.supplier);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(search) || 
        product.category.toLowerCase().includes(search) ||
        product.supplier.toLowerCase().includes(search)
      );
    }
    
    setFiltered(results);
  };

  const handleAddProduct = () => {
    toast.success("This would open a form to add a new product");
  };

  const toggleAIAssistant = () => {
    setShowAIAssistant(!showAIAssistant);
  };

  const handleAIAssist = (query: string) => {
    // In a real app, this would call an AI API
    console.log("AI query:", query);
    
    // Simulate AI response
    setTimeout(() => {
      if (query.toLowerCase().includes("low stock")) {
        alertToast({
          title: "AI Assistant",
          description: "I found 2 products with low stock levels. Would you like to generate a purchase order?",
          action: <Button variant="outline" size="sm">Generate PO</Button>,
        });
      } else if (query.toLowerCase().includes("price")) {
        alertToast({
          title: "AI Assistant",
          description: "I can help analyze pricing trends. The average product price is ₹48,225.",
        });
      } else {
        alertToast({
          title: "AI Assistant",
          description: "I'm analyzing your product inventory. How can I assist you today?",
        });
      }
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Products Inventory</h1>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={toggleAIAssistant}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
                AI Assistant
              </Button>
              <Button 
                className="flex items-center gap-2 bg-procurpal-primary text-white hover:bg-procurpal-primary/90"
                onClick={handleAddProduct}
              >
                <PlusCircle size={20} />
                Add Product
              </Button>
            </div>
          </div>

          {showAIAssistant && (
            <div className="mb-6">
              <AIAssistant onAIQuery={handleAIAssist} />
            </div>
          )}

          <ProductFilters onFilter={handleFilter} products={products} />
          
          <div className="mt-6">
            <ProductList products={filtered} />
          </div>
        </main>
      </div>
    </div>
  );
}
