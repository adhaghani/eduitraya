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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useRecipients } from "@/hooks/useRecipients";
import { Recipient } from "@/lib/types";
import {
  Download,
  Upload,
  Database,
  Trash2,
  AlertTriangle,
  CheckCircle,
  FileJson,
} from "lucide-react";
import { toast } from "sonner";

export function DataManagement() {
  const { recipients, clearAllRecipients } = useRecipients();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreData, setRestoreData] = useState<any>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);

  const handleBackup = () => {
    setIsBackingUp(true);
    try {
      const backupData = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        recipients: recipients,
        metadata: {
          totalRecipients: recipients.length,
          totalAmount: recipients.reduce((sum, r) => sum + r.amount, 0),
        },
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `eduit-raya-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Backup created successfully!", {
        description: "Your data has been downloaded as a JSON file.",
      });
    } catch (error) {
      toast.error("Failed to create backup");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backupData = JSON.parse(content);

        // Validate backup data structure
        if (!backupData.recipients || !Array.isArray(backupData.recipients)) {
          throw new Error("Invalid backup file format");
        }

        // Validate each recipient
        const validRecipients = backupData.recipients.filter(
          (recipient: any) => {
            return (
              recipient.id &&
              recipient.name &&
              typeof recipient.amount === "number" &&
              recipient.note
            );
          }
        );

        if (validRecipients.length === 0) {
          throw new Error("No valid recipients found in backup file");
        }

        // Store restore data and show confirmation dialog
        setRestoreData(validRecipients);
        setRestoreDialogOpen(true);
      } catch (error) {
        console.error("Restore error:", error);
        toast.error("Failed to restore backup", {
          description:
            "Please check that the file is a valid eDuit Raya backup.",
        });
      } finally {
        setIsRestoring(false);
        // Reset file input
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  };

  const handleClearAll = () => {
    clearAllRecipients();
    toast.success("All data cleared successfully");
  };

  const confirmRestore = () => {
    if (!restoreData) return;

    try {
      // Clear existing data and restore
      localStorage.setItem("eduitraya-recipients", JSON.stringify(restoreData));

      // Dispatch custom event to trigger state updates across all components
      window.dispatchEvent(new CustomEvent("recipients-updated"));

      // Also trigger storage event for good measure
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "eduitraya-recipients",
          newValue: JSON.stringify(restoreData),
          url: window.location.href,
        })
      );

      toast.success(`Successfully restored ${restoreData.length} recipients!`);
    } catch (error) {
      toast.error("Failed to restore data");
    } finally {
      setRestoreData(null);
      setRestoreDialogOpen(false);
      setIsRestoring(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Overview
          </CardTitle>
          <CardDescription>
            Current status of your eDuit Raya data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {recipients.length}
              </div>
              <p className="text-sm font-medium">Total Recipients</p>
              <p className="text-xs text-muted-foreground">Stored locally</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                RM {recipients.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
              </div>
              <p className="text-sm font-medium">Total Amount</p>
              <p className="text-xs text-muted-foreground">
                Ready to distribute
              </p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {new Date().toLocaleDateString()}
              </div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-xs text-muted-foreground">Browser storage</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Restore */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Backup Data
            </CardTitle>
            <CardDescription>
              Create a backup of all your recipients and data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Recommended</span>
              </div>
              <p className="text-sm text-green-700">
                Regular backups ensure you never lose your duit raya
                distribution data.
              </p>
            </div>

            <Button
              onClick={handleBackup}
              disabled={isBackingUp || recipients.length === 0}
              className="w-full"
            >
              {isBackingUp ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Backup...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  Download Backup
                </div>
              )}
            </Button>

            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Saves all recipient data</li>
              <li>• JSON format for easy storage</li>
              <li>• Can be restored anytime</li>
            </ul>
          </CardContent>
        </Card>

        {/* Restore */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Restore Data
            </CardTitle>
            <CardDescription>
              Restore recipients from a previous backup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Warning</span>
              </div>
              <p className="text-sm text-yellow-700">
                Restoring will replace all current data with the backup file.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="restore-file">Select backup file</Label>
              <Input
                id="restore-file"
                type="file"
                accept=".json"
                onChange={handleRestore}
                disabled={isRestoring}
              />
            </div>

            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Only accepts valid backup files</li>
              <li>• Will replace current data</li>
              <li>• Confirms before restoring</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that permanently delete your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800">Permanent Action</span>
            </div>
            <p className="text-sm text-red-700">
              This will permanently delete ALL recipients and cannot be undone.
              Make sure you have a backup first!
            </p>
          </div>

          <ConfirmDialog
            title="Clear All Data"
            description={`Are you sure you want to delete ALL ${recipients.length} recipients? This action cannot be undone and will permanently remove all your data.`}
            onConfirm={handleClearAll}
            confirmText="Delete All"
            variant="destructive"
          >
            <Button
              variant="destructive"
              disabled={recipients.length === 0}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </ConfirmDialog>

          <p className="text-xs text-muted-foreground text-center">
            This action requires confirmation to prevent accidental deletion
          </p>
        </CardContent>
      </Card>

      {/* Restore Confirmation Dialog */}
      <ConfirmDialog
        title="Restore Backup"
        description={`This will replace your current data with ${
          restoreData?.length || 0
        } recipients from the backup. Your existing data will be permanently lost. Continue?`}
        onConfirm={confirmRestore}
        confirmText="Restore"
        variant="destructive"
      >
        <div style={{ display: "none" }} />
      </ConfirmDialog>

      {/* Manual trigger for restore dialog */}
      {restoreDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Restore Backup</CardTitle>
              <CardDescription>
                This will replace your current data with{" "}
                {restoreData?.length || 0} recipients from the backup. Your
                existing data will be permanently lost.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setRestoreDialogOpen(false);
                    setRestoreData(null);
                    setIsRestoring(false);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmRestore}
                  variant="destructive"
                  className="flex-1"
                >
                  Restore
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
