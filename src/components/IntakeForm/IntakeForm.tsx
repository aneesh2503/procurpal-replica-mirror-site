
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import AIChatbot from './AIChatbot';
import BusinessInfoSection from './BusinessInfoSection';
import ProjectDetailsSection from './ProjectDetailsSection';
import ItemDetailsSection from './ItemDetailsSection';

const formSchema = z.object({
  // Business Info
  businessUnit: z.string().min(1, "Business Unit is required"),
  region: z.string().optional(),
  endUser: z.string().optional(),
  priority: z.string().optional(),
  industry: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  costCenter: z.string().optional(),

  // Project Details
  projectName: z.string().min(2, "Project name is required"),
  projectBudget: z.string().min(1, "Project budget is required"),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  currency: z.string().min(1, "Currency is required"),
  projectDescription: z.string().optional(),

  // Item Details
  itemName: z.string().min(2, "Item name is required"),
  itemDescription: z.string().optional(),
  quantity: z.string().optional(),
  uom: z.string().optional(),
  benchmarkPrice: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

const IntakeForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessUnit: "",
      region: "",
      endUser: "",
      priority: "",
      industry: "",
      category: "",
      costCenter: "",
      projectName: "",
      projectBudget: "",
      currency: "",
      projectDescription: "",
      itemName: "",
      itemDescription: "",
      quantity: "",
      uom: "",
      benchmarkPrice: "",
    },
  });

  const onSubmit = (data: FormData) => {
    toast.success("Form submitted successfully!", {
      description: "We'll process your request shortly.",
    });
    console.log(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg border-2 border-[#7E5DED]/20">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#000034]">Project Intake Form</h2>
      <AIChatbot form={form} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <BusinessInfoSection form={form} />
          <ProjectDetailsSection form={form} />
          <ItemDetailsSection form={form} />
          
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

export default IntakeForm;
