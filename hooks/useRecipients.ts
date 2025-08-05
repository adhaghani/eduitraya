import { useState, useEffect, useCallback } from "react";
import { Recipient, RecipientFormData } from "@/lib/types";
import { storageUtils } from "@/lib/storage";

// Custom event for state synchronization
const RECIPIENTS_UPDATED_EVENT = "recipients-updated";

// Helper function to dispatch update events
const dispatchRecipientsUpdate = () => {
  if (typeof window !== "undefined") {
    console.log("Dispatching recipients update event");
    window.dispatchEvent(new CustomEvent(RECIPIENTS_UPDATED_EVENT));
  }
};

export const useRecipients = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to refresh recipients from storage
  const refreshRecipients = useCallback(() => {
    try {
      const storedRecipients = storageUtils.getRecipients();
      console.log("Refreshing recipients:", storedRecipients.length);
      setRecipients(storedRecipients);
    } catch (error) {
      console.error("Error loading recipients:", error);
    }
  }, []);

  // Load recipients from localStorage on mount
  useEffect(() => {
    const loadRecipients = () => {
      setLoading(true);
      try {
        refreshRecipients();
      } finally {
        setLoading(false);
      }
    };

    loadRecipients();
  }, [refreshRecipients]);

  // Listen for storage updates from other components/tabs
  useEffect(() => {
    const handleStorageUpdate = () => {
      console.log("Storage update event received");
      refreshRecipients();
    };

    // Listen for custom events
    window.addEventListener(RECIPIENTS_UPDATED_EVENT, handleStorageUpdate);

    // Also listen for storage events (for updates from other tabs)
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener(RECIPIENTS_UPDATED_EVENT, handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [refreshRecipients]);

  // Add a new recipient
  const addRecipient = useCallback((recipientData: RecipientFormData) => {
    try {
      console.log("Adding recipient:", recipientData);
      const newRecipient = storageUtils.addRecipient(recipientData);
      setRecipients((prev) => {
        const updated = [...prev, newRecipient];
        console.log("Updated recipients count:", updated.length);
        return updated;
      });
      dispatchRecipientsUpdate();
      return newRecipient;
    } catch (error) {
      console.error("Error adding recipient:", error);
      throw error;
    }
  }, []);

  // Update a recipient
  const updateRecipient = useCallback(
    (id: string, updates: Partial<RecipientFormData>) => {
      try {
        const updatedRecipient = storageUtils.updateRecipient(id, updates);
        if (updatedRecipient) {
          setRecipients((prev) =>
            prev.map((r) => (r.id === id ? updatedRecipient : r))
          );
          dispatchRecipientsUpdate();
          return updatedRecipient;
        }
        return null;
      } catch (error) {
        console.error("Error updating recipient:", error);
        throw error;
      }
    },
    []
  );

  // Delete a recipient
  const deleteRecipient = useCallback((id: string) => {
    try {
      const success = storageUtils.deleteRecipient(id);
      if (success) {
        setRecipients((prev) => prev.filter((r) => r.id !== id));
        dispatchRecipientsUpdate();
      }
      return success;
    } catch (error) {
      console.error("Error deleting recipient:", error);
      throw error;
    }
  }, []);

  // Clear all recipients
  const clearAllRecipients = useCallback(() => {
    try {
      storageUtils.clearAll();
      setRecipients([]);
      dispatchRecipientsUpdate();
    } catch (error) {
      console.error("Error clearing recipients:", error);
      throw error;
    }
  }, []);

  // Calculate totals
  const totalAmount = recipients.reduce(
    (sum, recipient) => sum + recipient.amount,
    0
  );
  const totalRecipients = recipients.length;

  return {
    recipients,
    loading,
    totalAmount,
    totalRecipients,
    addRecipient,
    updateRecipient,
    deleteRecipient,
    clearAllRecipients,
    refreshRecipients, // Expose refresh function for manual updates
  };
};
