
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, Search } from "lucide-react";

export interface ItemDetailsProps {
  form: any;
}

const ItemDetailsSection = ({ form }: ItemDetailsProps) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload logic here
    console.log('File uploaded:', e.target.files);
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#000034]">Item Details</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex gap-2 items-center border-[#7E5DED] text-[#7E5DED] hover:bg-[#7E5DED]/10"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            className="flex gap-2 items-center border-[#7E5DED] text-[#7E5DED] hover:bg-[#7E5DED]/10"
          >
            <Upload className="h-4 w-4" />
            Import Items
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="itemName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#000034]">Item Name *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Name" 
                  {...field} 
                  className="border-[#04D3DC] focus-visible:ring-[#7E5DED]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="itemDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#000034]">Item Description</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Description" 
                  {...field} 
                  className="border-[#04D3DC] focus-visible:ring-[#7E5DED]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#000034]">Quantity</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Quantity" 
                  {...field} 
                  className="border-[#04D3DC] focus-visible:ring-[#7E5DED]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="uom"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#000034]">UOM</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-[#04D3DC] focus-visible:ring-[#7E5DED]">
                    <SelectValue placeholder="Select UOM" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pcs">Pieces</SelectItem>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="ltr">Liters</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="benchmarkPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#000034]">Benchmark Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter benchmark price" 
                  {...field} 
                  className="border-[#04D3DC] focus-visible:ring-[#7E5DED]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <FormLabel className="text-[#000034]">Attach Sample Requirement (optional)</FormLabel>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            className="border-[#04D3DC] focus-visible:ring-[#7E5DED]"
            onChange={handleFileUpload}
          />
          <Button
            type="button"
            className="bg-[#7E5DED] hover:bg-[#7E5DED]/90 text-white"
          >
            Upload
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel className="text-[#000034]">Supplier Recommendation</FormLabel>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search"
            className="border-[#04D3DC] focus-visible:ring-[#7E5DED]"
          />
          <Button
            type="button"
            className="bg-[#7E5DED] hover:bg-[#7E5DED]/90 text-white"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full mt-4 flex gap-2 items-center justify-center border-[#7E5DED] text-[#7E5DED] hover:bg-[#7E5DED]/10"
        onClick={() => console.log('Add another item')}
      >
        <Plus className="h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
};

export default ItemDetailsSection;
