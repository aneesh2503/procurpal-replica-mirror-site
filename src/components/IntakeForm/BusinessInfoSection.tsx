
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export interface BusinessInfoProps {
  form: any;
}

const BusinessInfoSection = ({ form }: BusinessInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#000034] mb-4">Business Information</h3>
      
      <FormField
        control={form.control}
        name="businessUnit"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#000034]">Business Unit *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="border-[#04D3DC] focus-visible:ring-[#7E5DED]">
                  <SelectValue placeholder="Select Business Unit" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="unit1">Business Unit 1</SelectItem>
                <SelectItem value="unit2">Business Unit 2</SelectItem>
                <SelectItem value="unit3">Business Unit 3</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="region"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#000034]">Region</FormLabel>
            <FormControl>
              <Input 
                placeholder="Add Region" 
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
        name="endUser"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#000034]">End User</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="border-[#04D3DC] focus-visible:ring-[#7E5DED]">
                  <SelectValue placeholder="Select End User" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="user1">End User 1</SelectItem>
                <SelectItem value="user2">End User 2</SelectItem>
                <SelectItem value="user3">End User 3</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#000034]">Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-[#04D3DC] focus-visible:ring-[#7E5DED]">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#000034]">Industry</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-[#04D3DC] focus-visible:ring-[#7E5DED]">
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#000034]">Category *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-[#04D3DC] focus-visible:ring-[#7E5DED]">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cat1">Category 1</SelectItem>
                  <SelectItem value="cat2">Category 2</SelectItem>
                  <SelectItem value="cat3">Category 3</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="costCenter"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#000034]">Cost Center</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter Cost Center" 
                  {...field} 
                  className="border-[#04D3DC] focus-visible:ring-[#7E5DED]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BusinessInfoSection;
