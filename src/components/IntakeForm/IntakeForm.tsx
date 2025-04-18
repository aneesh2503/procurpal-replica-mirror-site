
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import AIChatbot from './AIChatbot';

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.date({
    required_error: "Please select a date",
  }),
});

export type FormData = z.infer<typeof formSchema>;

const IntakeForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (data: FormData) => {
    toast.success("Form submitted successfully!", {
      description: "We'll contact you soon.",
    });
    console.log(data);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg border-2 border-[#7E5DED]/20">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#000034]">Intake Form</h2>
      <AIChatbot form={form} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#000034]">Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="John Doe" 
                    {...field} 
                    className="border-[#04D3DC] focus-visible:ring-[#7E5DED]"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#000034]">Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="john@example.com" 
                    {...field} 
                    className="border-[#04D3DC] focus-visible:ring-[#7E5DED]"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#000034]">Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
                    placeholder="(123) 456-7890" 
                    {...field} 
                    className="border-[#04D3DC] focus-visible:ring-[#7E5DED]"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-[#000034]">Date of Birth</FormLabel>
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
                        {field.value && isValidDate(field.value) ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
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
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-[#7E5DED] hover:bg-[#7E5DED]/90 text-white"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

// Helper function to validate date objects
function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export default IntakeForm;
