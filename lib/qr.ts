import QRCode from "qrcode";

export const qrUtils = {
  // Generate QR code data URL for DuitNow
  generateDuitNowQR: async (
    duitnowId: string,
    amount?: number,
    recipientName?: string
  ): Promise<string> => {
    try {
      // DuitNow QR format (simplified version)
      // In real implementation, you'd need to follow the proper DuitNow QR specification
      const qrData = {
        duitnowId,
        amount: amount || 0,
        recipient: recipientName || "",
        timestamp: new Date().toISOString(),
      };

      const qrString = JSON.stringify(qrData);
      const qrCodeDataURL = await QRCode.toDataURL(qrString, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      return qrCodeDataURL;
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw new Error("Failed to generate QR code");
    }
  },

  // Generate simple payment QR (for demo purposes)
  generatePaymentQR: async (
    recipientName: string,
    amount: number,
    duitnowId?: string
  ): Promise<string> => {
    try {
      const paymentData = `PAY:${recipientName}:${amount}${
        duitnowId ? `:${duitnowId}` : ""
      }`;

      const qrCodeDataURL = await QRCode.toDataURL(paymentData, {
        width: 150,
        margin: 1,
        color: {
          dark: "#16a34a", // Green color for payment QR
          light: "#FFFFFF",
        },
      });

      return qrCodeDataURL;
    } catch (error) {
      console.error("Error generating payment QR code:", error);
      throw new Error("Failed to generate payment QR code");
    }
  },
};
