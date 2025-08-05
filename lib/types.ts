export interface Recipient {
  id: string;
  name: string;
  amount: number;
  note: string;
  duitnowId?: string; // Optional DuitNow QR link field
  dateAdded: string;
}

export interface RecipientFormData {
  name: string;
  amount: number;
  note: string;
  duitnowId?: string;
}

export interface ExportData {
  recipients: Recipient[];
  totalAmount: number;
  exportDate: string;
  totalRecipients: number;
}
