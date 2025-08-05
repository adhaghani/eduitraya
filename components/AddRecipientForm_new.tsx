"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useRecipients } from "@/hooks/useRecipients";
import { RecipientFormData } from "@/lib/types";
import {
  Plus,
  DollarSign,
  User,
  MessageSquare,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";

const recipientSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  amount: z
    .number()
    .min(0.01, "Amount must be at least RM 0.01")
    .max(10000, "Amount must be less than RM 10,000"),
  note: z
    .string()
    .min(1, "Note is required")
    .max(100, "Note must be less than 100 characters"),
  duitnowId: z.string().optional(),
});

interface AddRecipientFormProps {
  onSuccess?: () => void;
}

export function AddRecipientForm({ onSuccess }: AddRecipientFormProps) {
  const { addRecipient } = useRecipients();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecipientFormData>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
      name: "",
      amount: 0,
      note: "",
      duitnowId: "",
    },
  });

  const onSubmit = async (data: RecipientFormData) => {
    setIsSubmitting(true);
    try {
      await addRecipient(data);
      reset();
      toast.success(`Successfully added ${data.name} to your list!`, {
        description: `Amount: RM ${data.amount.toFixed(2)}`,
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error adding recipient:", error);
      toast.error("Failed to add recipient", {
        description: "Please try again or check your input.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Recipient Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Ahmad, Siti, etc."
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Amount Field */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Amount (RM)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max="10000"
                placeholder="e.g., 50.00"
                {...register("amount", { valueAsNumber: true })}
                className={errors.amount ? "border-red-500" : ""}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>
          </div>

          {/* Note Field */}
          <div className="space-y-2">
            <Label htmlFor="note" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Note / Relationship
            </Label>
            <Textarea
              id="note"
              placeholder="e.g., Cousin, Nephew, Friend, etc."
              rows={3}
              {...register("note")}
              className={errors.note ? "border-red-500" : ""}
            />
            {errors.note && (
              <p className="text-sm text-red-500">{errors.note.message}</p>
            )}
          </div>

          {/* DuitNow ID Field (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="duitnowId" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              DuitNow ID (Optional)
            </Label>
            <Input
              id="duitnowId"
              placeholder="e.g., phone number, NRIC, etc."
              {...register("duitnowId")}
            />
            <p className="text-xs text-muted-foreground">
              Enter phone number, NRIC, or other DuitNow identifier for QR code
              generation
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Recipient
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
