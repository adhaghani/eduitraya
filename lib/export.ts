import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { Recipient, ExportData } from "./types";

export const exportUtils = {
  // Export to CSV
  exportToCSV: (recipients: Recipient[], filename?: string): void => {
    const csvData = recipients.map((recipient) => ({
      Name: recipient.name,
      Amount: `RM ${recipient.amount.toFixed(2)}`,
      Note: recipient.note,
      "DuitNow ID": recipient.duitnowId || "",
      "Date Added": new Date(recipient.dateAdded).toLocaleDateString(),
    }));

    // Add summary row
    const totalAmount = recipients.reduce((sum, r) => sum + r.amount, 0);
    csvData.push({
      Name: "",
      Amount: "",
      Note: "",
      "DuitNow ID": "",
      "Date Added": "",
    });
    csvData.push({
      Name: "TOTAL",
      Amount: `RM ${totalAmount.toFixed(2)}`,
      Note: `${recipients.length} recipients`,
      "DuitNow ID": "",
      "Date Added": new Date().toLocaleDateString(),
    });

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "eDuit Raya");

    const fileName =
      filename || `eduit-raya-${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  },

  // Export to PDF
  exportToPDF: (recipients: Recipient[], filename?: string): void => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;

    // Title
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("eDuit Raya Distribution List", pageWidth / 2, yPosition, {
      align: "center",
    });

    yPosition += 20;

    // Summary
    const totalAmount = recipients.reduce((sum, r) => sum + r.amount, 0);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Total Recipients: ${recipients.length}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Total Amount: RM ${totalAmount.toFixed(2)}`, margin, yPosition);
    yPosition += 8;
    pdf.text(
      `Export Date: ${new Date().toLocaleDateString()}`,
      margin,
      yPosition
    );
    yPosition += 20;

    // Table headers
    pdf.setFont("helvetica", "bold");
    pdf.text("Name", margin, yPosition);
    pdf.text("Amount", margin + 60, yPosition);
    pdf.text("Note", margin + 100, yPosition);
    pdf.text("DuitNow ID", margin + 140, yPosition);
    yPosition += 10;

    // Draw line under headers
    pdf.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
    yPosition += 5;

    // Table content
    pdf.setFont("helvetica", "normal");
    recipients.forEach((recipient, index) => {
      // Check if we need a new page
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 30;
      }

      const name =
        recipient.name.length > 15
          ? recipient.name.substring(0, 15) + "..."
          : recipient.name;
      const note =
        recipient.note.length > 12
          ? recipient.note.substring(0, 12) + "..."
          : recipient.note;
      const duitnow =
        recipient.duitnowId?.length && recipient.duitnowId.length > 15
          ? recipient.duitnowId.substring(0, 15) + "..."
          : recipient.duitnowId || "";

      pdf.text(name, margin, yPosition);
      pdf.text(`RM ${recipient.amount.toFixed(2)}`, margin + 60, yPosition);
      pdf.text(note, margin + 100, yPosition);
      pdf.text(duitnow, margin + 140, yPosition);

      yPosition += 8;
    });

    // Footer
    yPosition += 10;
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    pdf.setFont("helvetica", "bold");
    pdf.text(`TOTAL: RM ${totalAmount.toFixed(2)}`, margin, yPosition);

    const fileName =
      filename || `eduit-raya-${new Date().toISOString().split("T")[0]}.pdf`;
    pdf.save(fileName);
  },

  // Generate export data for sharing
  generateExportData: (recipients: Recipient[]): ExportData => {
    return {
      recipients,
      totalAmount: recipients.reduce((sum, r) => sum + r.amount, 0),
      exportDate: new Date().toISOString(),
      totalRecipients: recipients.length,
    };
  },
};
