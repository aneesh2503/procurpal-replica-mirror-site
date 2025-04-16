
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowUpRight, LineChart, ShoppingCart, Loader2 } from "lucide-react";

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

interface AIProductInsightProps {
  product: Product;
  onClose: () => void;
}

export function AIProductInsight({ product, onClose }: AIProductInsightProps) {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Simulate AI analysis with a timer
    const timer = setTimeout(() => {
      // Generate insights based on product data
      const generatedInsights = [
        `This product has ${
          product.status === "in-stock" ? "healthy" : 
          product.status === "low-stock" ? "concerning" : "critical"
        } inventory levels with ${product.stock} units in stock.`,
        `The price point of ${(product.price / 100).toLocaleString('en-IN', {
          style: 'currency',
          currency: 'INR'
        })} is ${product.price > 10000 ? "above" : "below"} the category average.`,
        `Last inventory update was on ${product.lastUpdated}, which is ${
          new Date(product.lastUpdated) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
            ? "over a month ago and may need verification." 
            : "recent and likely accurate."
        }`,
        `This product is supplied by ${product.supplier}, who also provides ${
          Math.floor(Math.random() * 5) + 1
        } other products in your inventory.`
      ];
      
      // Generate recommendations based on product status
      const generatedRecommendations = [];
      
      if (product.status === "out-of-stock") {
        generatedRecommendations.push(
          "Place an order immediately with the supplier to replenish stock.",
          "Consider revising the reorder point for this product to prevent future stockouts.",
          "Analyze recent sales data to determine optimal order quantity."
        );
      } else if (product.status === "low-stock") {
        generatedRecommendations.push(
          "Prepare purchase order for this product within the next 7 days.",
          "Review lead time with supplier to optimize reorder timing.",
          "Consider negotiating volume discounts for this frequently ordered item."
        );
      } else {
        generatedRecommendations.push(
          "Monitor inventory levels through regular monthly checks.",
          "Explore potential for bulk discounts on future orders.",
          "Analyze sales velocity to determine if inventory levels can be optimized."
        );
      }
      
      setInsights(generatedInsights);
      setRecommendations(generatedRecommendations);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [product]);

  return (
    <Dialog open onOpenChange={() => !loading && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-procurpal-primary" />
            <DialogTitle>AI Product Insights</DialogTitle>
          </div>
        </DialogHeader>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 text-procurpal-primary animate-spin mb-4" />
            <p className="text-gray-500">Analyzing product data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              <div className="col-span-1 md:col-span-3">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <div className="bg-procurpal-primary/10 text-procurpal-primary rounded-full p-1">
                    <ShoppingCart size={16} />
                  </div>
                  {product.name}
                </h3>
                <p className="text-gray-500 mb-6">
                  Category: {product.category} | Supplier: {product.supplier}
                </p>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <LineChart size={16} />
                    AI Analysis
                  </h4>
                  
                  <ul className="space-y-2">
                    {insights.map((insight, index) => (
                      <li key={index} className="bg-gray-50 p-3 rounded-lg text-gray-700">
                        {insight}
                      </li>
                    ))}
                  </ul>
                  
                  <h4 className="font-medium text-gray-700 flex items-center gap-2 mt-6">
                    <ArrowUpRight size={16} />
                    Recommendations
                  </h4>
                  
                  <ul className="space-y-2">
                    {recommendations.map((recommendation, index) => (
                      <li key={index} className="bg-blue-50 p-3 rounded-lg text-blue-700">
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="col-span-1 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline" size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Create Purchase Order
                  </Button>
                  <Button className="w-full justify-start" variant="outline" size="sm">
                    <LineChart className="mr-2 h-4 w-4" />
                    View Sales History
                  </Button>
                  <Button className="w-full justify-start" variant="outline" size="sm">
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Adjust Stock Level
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
