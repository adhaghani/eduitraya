"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useRecipients } from "@/hooks/useRecipients";
import { Zap, DollarSign, Users, Plus } from "lucide-react";
import { toast } from "sonner";

const commonAmounts = [
  { amount: 5, label: "RM 5", description: "Children" },
  { amount: 10, label: "RM 10", description: "Young relatives" },
  { amount: 20, label: "RM 20", description: "Standard" },
  { amount: 50, label: "RM 50", description: "Close family" },
  { amount: 100, label: "RM 100", description: "Special" },
];

interface QuickActionsProps {
  onAddRecipient?: () => void;
}

export function QuickActions({ onAddRecipient }: QuickActionsProps) {
  const { addRecipient } = useRecipients();
  const [bulkAmount, setBulkAmount] = useState<number>(20);
  const [bulkCount, setBulkCount] = useState<number>(5);
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = async (amount: number, description: string) => {
    const recipientData = {
      name: `Recipient ${Date.now()}`,
      amount,
      note: description,
    };

    try {
      await addRecipient(recipientData);
      toast.success(`Quick added ${description} recipient`, {
        description: `Amount: RM ${amount.toFixed(2)}`,
      });
    } catch (error) {
      toast.error("Failed to add recipient");
      console.error("Quick add error:", error);
    }
  };

  const handleBulkAdd = async () => {
    if (bulkCount <= 0 || bulkAmount <= 0) {
      toast.error("Please enter valid values");
      return;
    }

    setIsAdding(true);
    try {
      const promises = Array.from({ length: bulkCount }, (_, i) =>
        addRecipient({
          name: `Recipient ${Date.now() + i}`,
          amount: bulkAmount,
          note: `Bulk added (${i + 1}/${bulkCount})`,
        })
      );

      await Promise.all(promises);

      toast.success(
        `Successfully added ${bulkCount} recipients for RM ${(
          bulkAmount * bulkCount
        ).toFixed(2)}`
      );
    } catch (error) {
      toast.error("Failed to add bulk recipients");
      console.error("Bulk add error:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Add with Common Amounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Add Recipients
          </CardTitle>
          <CardDescription>
            Add recipients quickly with common duit raya amounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {commonAmounts.map((preset) => (
              <Button
                key={preset.amount}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() =>
                  handleQuickAdd(preset.amount, preset.description)
                }
              >
                <DollarSign className="h-4 w-4" />
                <span className="font-bold">{preset.label}</span>
                <span className="text-xs text-muted-foreground">
                  {preset.description}
                </span>
              </Button>
            ))}
          </div>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> These will create placeholder recipients
              that you can edit later with proper names and details.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Add */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Add Recipients
          </CardTitle>
          <CardDescription>
            Add multiple recipients at once with the same amount
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bulk-amount">Amount per recipient (RM)</Label>
              <Input
                id="bulk-amount"
                type="number"
                step="0.01"
                min="0.01"
                value={bulkAmount}
                onChange={(e) => setBulkAmount(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulk-count">Number of recipients</Label>
              <Input
                id="bulk-count"
                type="number"
                min="1"
                max="50"
                value={bulkCount}
                onChange={(e) => setBulkCount(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Total Preview</p>
              <p className="text-sm text-muted-foreground">
                {bulkCount} recipients × RM {bulkAmount.toFixed(2)} each
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              RM {(bulkAmount * bulkCount).toFixed(2)}
            </Badge>
          </div>

          <Button
            onClick={handleBulkAdd}
            disabled={isAdding || bulkCount <= 0 || bulkAmount <= 0}
            className="w-full"
          >
            {isAdding ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Adding {bulkCount} recipients...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add {bulkCount} Recipients
              </div>
            )}
          </Button>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Note:</strong> Bulk added recipients will have
              placeholder names. You can edit them individually later to add
              proper names and notes.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common actions for managing your duit raya list
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onAddRecipient}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Custom Recipient</span>
              <span className="text-xs text-muted-foreground">
                With full details
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => {
                window.location.hash = "#export";
                toast.info("Navigate to Export tab to download your data");
              }}
            >
              <DollarSign className="h-5 w-5" />
              <span>Export Data</span>
              <span className="text-xs text-muted-foreground">
                PDF or Excel
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
