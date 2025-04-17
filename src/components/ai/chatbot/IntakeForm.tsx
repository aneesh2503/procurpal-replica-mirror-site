
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { IntakeFormData } from "./types";
import { Check, ChevronRight, Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  company: z.string().min(2, { message: "Please enter your company name" }),
  role: z.string().min(2, { message: "Please enter your role" }),
  requirements: z.string().min(10, { message: "Please provide more details (at least 10 characters)" }),
  priority: z.enum(["low", "medium", "high"]),
});

interface IntakeFormProps {
  onSubmit: (data: IntakeFormData) => void;
  onCancel: () => void;
}

export function IntakeForm({ onSubmit, onCancel }: IntakeFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      role: "",
      requirements: "",
      priority: "medium",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(values as IntakeFormData);
      setIsSubmitting(false);
    }, 1000); // Simulating API call
  };

  const nextStep = async () => {
    if (step === 1) {
      const nameValid = await form.trigger("name");
      const emailValid = await form.trigger("email");
      if (!nameValid || !emailValid) return;
    } else if (step === 2) {
      const companyValid = await form.trigger("company");
      const roleValid = await form.trigger("role");
      if (!companyValid || !roleValid) return;
    }
    setStep(prev => prev < totalSteps ? prev + 1 : prev);
  };

  const prevStep = () => {
    setStep(prev => prev > 1 ? prev - 1 : prev);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-sm font-medium">Procurement Request Form</h3>
        <div className="text-xs text-gray-500">Step {step} of {totalSteps}</div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {step === 1 && (
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Procurement Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Procurement Requirements</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please describe what you need to procure..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority Level</FormLabel>
                    <div className="flex gap-2">
                      {["low", "medium", "high"].map((priority) => (
                        <Button
                          key={priority}
                          type="button"
                          variant={field.value === priority ? "default" : "outline"}
                          className={`flex-1 capitalize ${
                            priority === "high" ? "hover:bg-red-100" : 
                            priority === "medium" ? "hover:bg-amber-100" : 
                            "hover:bg-green-100"
                          }`}
                          onClick={() => form.setValue("priority", priority as "low" | "medium" | "high")}
                        >
                          {priority}
                          {field.value === priority && <Check className="ml-2" size={16} />}
                        </Button>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="flex justify-between pt-2">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}

            {step < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Next <ChevronRight size={16} />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
