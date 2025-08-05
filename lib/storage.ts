import { Recipient } from "./types";

const STORAGE_KEY = "eduitraya-recipients";

export const storageUtils = {
  // Get all recipients from localStorage
  getRecipients: (): Recipient[] => {
    if (typeof window === "undefined") return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  },

  // Save recipients to localStorage
  saveRecipients: (recipients: Recipient[]): void => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipients));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  // Add a new recipient
  addRecipient: (recipient: Omit<Recipient, "id" | "dateAdded">): Recipient => {
    const newRecipient: Recipient = {
      ...recipient,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString(),
    };

    const recipients = storageUtils.getRecipients();
    recipients.push(newRecipient);
    storageUtils.saveRecipients(recipients);

    return newRecipient;
  },

  // Update a recipient
  updateRecipient: (
    id: string,
    updates: Partial<Omit<Recipient, "id" | "dateAdded">>
  ): Recipient | null => {
    const recipients = storageUtils.getRecipients();
    const index = recipients.findIndex((r) => r.id === id);

    if (index === -1) return null;

    recipients[index] = { ...recipients[index], ...updates };
    storageUtils.saveRecipients(recipients);

    return recipients[index];
  },

  // Delete a recipient
  deleteRecipient: (id: string): boolean => {
    const recipients = storageUtils.getRecipients();
    const filteredRecipients = recipients.filter((r) => r.id !== id);

    if (filteredRecipients.length === recipients.length) return false;

    storageUtils.saveRecipients(filteredRecipients);
    return true;
  },

  // Get total amount distributed
  getTotalAmount: (): number => {
    const recipients = storageUtils.getRecipients();
    return recipients.reduce((total, recipient) => total + recipient.amount, 0);
  },

  // Clear all data
  clearAll: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
