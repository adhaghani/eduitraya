"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useRecipients } from "@/hooks/useRecipients";
import { Recipient } from "@/lib/types";
import { qrUtils } from "@/lib/qr";
import { toast } from "sonner";
import {
  Edit,
  Trash2,
  QrCode,
  DollarSign,
  User,
  MessageSquare,
  Smartphone,
  Calendar,
  Search,
  Filter,
} from "lucide-react";

export function RecipientsList() {
  const {
    recipients,
    updateRecipient,
    deleteRecipient,
    totalAmount,
    totalRecipients,
  } = useRecipients();
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(
    null
  );
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "amount" | "date">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filter and sort recipients
  const filteredAndSortedRecipients = recipients
    .filter(
      (recipient) =>
        recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipient.note.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "date":
          aValue = new Date(a.dateAdded).getTime();
          bValue = new Date(b.dateAdded).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleEdit = (recipient: Recipient) => {
    setEditingRecipient(recipient);
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingRecipient) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      name: formData.get("name") as string,
      amount: parseFloat(formData.get("amount") as string),
      note: formData.get("note") as string,
      duitnowId: formData.get("duitnowId") as string,
    };

    try {
      await updateRecipient(editingRecipient.id, updates);
      setEditingRecipient(null);
    } catch (error) {
      console.error("Error updating recipient:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRecipient(id);
      toast.success("Recipient deleted successfully");
    } catch (error) {
      console.error("Error deleting recipient:", error);
      toast.error("Failed to delete recipient");
    }
  };

  const handleShowQR = async (recipient: Recipient) => {
    if (!recipient.duitnowId) {
      toast.error("No DuitNow ID available for this recipient");
      return;
    }

    try {
      const qrDataUrl = await qrUtils.generatePaymentQR(
        recipient.name,
        recipient.amount,
        recipient.duitnowId
      );
      setQrCode(qrDataUrl);
      setQrDialogOpen(true);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    }
  };

  const toggleSort = (field: "name" | "amount" | "date") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  if (recipients.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No recipients yet</h3>
        <p className="text-muted-foreground">
          Add your first recipient to start tracking your duit raya
          distribution.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Recipients</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totalRecipients}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Amount</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              RM {totalAmount.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Average Amount</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              RM{" "}
              {totalRecipients > 0
                ? (totalAmount / totalRecipients).toFixed(2)
                : "0.00"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleSort("name")}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleSort("amount")}
            className="flex items-center gap-2"
          >
            Amount {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleSort("date")}
            className="flex items-center gap-2"
          >
            Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
          </Button>
        </div>
      </div>

      {/* Recipients Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>DuitNow ID</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedRecipients.map((recipient) => (
              <TableRow key={recipient.id}>
                <TableCell className="font-medium">{recipient.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    RM {recipient.amount.toFixed(2)}
                  </Badge>
                </TableCell>
                <TableCell>{recipient.note}</TableCell>
                <TableCell>
                  {recipient.duitnowId ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{recipient.duitnowId}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShowQR(recipient)}
                      >
                        <QrCode className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(recipient.dateAdded).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(recipient)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <ConfirmDialog
                      title="Delete Recipient"
                      description={`Are you sure you want to delete ${recipient.name}? This action cannot be undone.`}
                      onConfirm={() => handleDelete(recipient.id)}
                      confirmText="Delete"
                      variant="destructive"
                    >
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </ConfirmDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingRecipient}
        onOpenChange={() => setEditingRecipient(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Recipient</DialogTitle>
            <DialogDescription>
              Update the recipient information
            </DialogDescription>
          </DialogHeader>
          {editingRecipient && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingRecipient.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-amount">Amount (RM)</Label>
                <Input
                  id="edit-amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  defaultValue={editingRecipient.amount}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-note">Note</Label>
                <Textarea
                  id="edit-note"
                  name="note"
                  defaultValue={editingRecipient.note}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-duitnowId">DuitNow ID</Label>
                <Input
                  id="edit-duitnowId"
                  name="duitnowId"
                  defaultValue={editingRecipient.duitnowId || ""}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingRecipient(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment QR Code</DialogTitle>
            <DialogDescription>Show this QR code for payment</DialogDescription>
          </DialogHeader>
          {qrCode && (
            <div className="text-center">
              <img
                src={qrCode}
                alt="Payment QR Code"
                className="mx-auto mb-4"
              />
              <p className="text-sm text-muted-foreground">
                Scan this QR code to make payment via DuitNow
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
