
import React from 'react';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface ProjectDetailsProps {
  form: any;
}

const ProjectDetailsSection = ({ form }: ProjectDetailsProps) => {
  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-semibold text-[#000034] mb-4">Project Details</h3>
      
      <FormField
        control={form.control}
        name="projectName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#000034]">Project Name *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter Project name" 
                {...field} 
                className="border-[#04D3DC] focus-visible:ring-[#7E5DED]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="projectBudget"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#000034]">Project Budget (Estimated) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Add Budget" 
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
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#000034]">Currency *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-[#04D3DC] focus-visible:ring-[#7E5DED]">
                    <SelectValue placeholder="Select Project Currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="dueDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-[#000034]">Due Date *</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal border-[#04D3DC]",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Due Date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-[#7E5DED]" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="projectDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#000034]">Project Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="A brief about the requirements" 
                {...field}
                className="border-[#04D3DC] focus-visible:ring-[#7E5DED] min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProjectDetailsSection;
