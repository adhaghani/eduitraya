# 💰 eDuit Raya Splitter

A modern web application to help you track and manage your duit raya (Hari Raya money) distribution with ease. Built with Next.js, TypeScript, and shadcn/ui components.

## ✨ Features

### Core Features

- **Add Recipients**: Add recipients with name, amount, note, and optional DuitNow ID
- **Recipients List**: View, edit, and manage all recipients with search and sorting
- **Dashboard Overview**: Quick stats and recent recipients preview
- **Statistics & Analytics**: Detailed analysis of your distribution patterns
- **Export Functionality**: Export data as PDF or Excel/CSV files
- **Quick Actions**: Bulk add recipients and common amount shortcuts

### Additional Features

- **DuitNow QR Codes**: Generate QR codes for recipients with DuitNow IDs
- **Local Storage**: All data is stored locally in your browser
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Automatic theme detection
- **Toast Notifications**: User-friendly feedback for actions
- **Search & Filter**: Find recipients quickly with search and sorting options

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **TypeScript**: Full type safety
- **Forms**: React Hook Form with Zod validation
- **Storage**: Browser localStorage (no backend required)
- **Export**: jsPDF for PDF generation, SheetJS for Excel/CSV
- **QR Codes**: qrcode library for payment QR generation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd eduitraya
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm run start
```

## 📖 How to Use

### 1. Adding Recipients

#### Individual Addition

1. Go to the "Add Recipient" tab
2. Fill in the recipient details:
   - **Name**: Full name of the recipient
   - **Amount**: Amount in RM (Malaysian Ringgit)
   - **Note**: Relationship or notes (e.g., "Cousin", "Nephew")
   - **DuitNow ID**: Optional phone number or NRIC for QR codes
3. Click "Add Recipient"

#### Quick Addition

1. Use the "Quick Actions" section on the Dashboard
2. Click on pre-set amounts (RM 5, RM 10, RM 20, RM 50, RM 100)
3. Edit the recipient details later if needed

#### Bulk Addition

1. Use the "Bulk Add Recipients" feature
2. Set the amount per recipient and number of recipients
3. Click "Add [X] Recipients"
4. Edit individual names and details later

### 2. Managing Recipients

#### View All Recipients

- Go to "Recipients List" tab
- View all recipients in a sortable table
- Use search to find specific recipients
- Sort by name, amount, or date added

#### Edit Recipients

- Click the edit icon (pencil) next to any recipient
- Update their information in the dialog
- Save changes

#### Delete Recipients

- Click the delete icon (trash) next to any recipient
- Confirm deletion in the prompt

#### Generate QR Codes

- Click the QR code icon for recipients with DuitNow IDs
- Share the QR code for easy payments

### 3. Statistics & Analytics

Visit the "Statistics" tab to see:

- Total recipients and amounts
- Average, highest, and lowest amounts
- Distribution analysis by amount ranges
- Recent activity and trends

### 4. Exporting Data

#### PDF Export

1. Go to "Export" tab
2. Optionally enter a custom filename
3. Click "Download PDF"
4. Get a formatted PDF with all recipient details

#### Excel Export

1. Go to "Export" tab
2. Optionally enter a custom filename
3. Click "Download Excel"
4. Get an Excel file (.xlsx) for further analysis

#### Quick Share

- Copy summary text to clipboard for quick sharing
- Includes all essential information in text format

## 💾 Data Storage

- All data is stored in your browser's localStorage
- No data is sent to external servers
- Data persists until you clear browser data
- Export your data regularly as backup

## 🔧 Data Structure

The app stores recipients with the following structure:

```typescript
interface Recipient {
  id: string;
  name: string;
  amount: number;
  note: string;
  duitnowId?: string;
  dateAdded: string;
}
```

## 🎨 Customization

### Themes

The app automatically detects your system's dark/light mode preference. The theme uses a green color scheme suitable for the festive season.

### Common Amounts

You can modify the common amounts in the Quick Actions by editing the `commonAmounts` array in `/components/QuickActions.tsx`.

## 📱 Mobile Support

The app is fully responsive and works well on:

- Desktop computers
- Tablets
- Mobile phones (iOS and Android)

## 🔒 Privacy & Security

- **No Data Collection**: No personal data is collected or transmitted
- **Local Storage Only**: All data stays on your device
- **No Registration**: No account required, use immediately
- **Offline Capable**: Works without internet after initial load

## 🛠️ Development

### Project Structure

```
eduitraya/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── AddRecipientForm.tsx
│   ├── RecipientsList.tsx
│   ├── ExportPage.tsx
│   ├── StatsOverview.tsx
│   └── QuickActions.tsx
├── hooks/                # Custom React hooks
│   └── useRecipients.ts
├── lib/                  # Utility functions
│   ├── types.ts         # TypeScript types
│   ├── storage.ts       # localStorage utilities
│   ├── export.ts        # Export functions
│   ├── qr.ts           # QR code generation
│   └── utils.ts        # General utilities
└── public/              # Static assets
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Feel free to contribute to this project by:

1. Reporting issues
2. Suggesting new features
3. Submitting pull requests

## 📄 License

This project is open source and available under the MIT License.

## 🎉 About Hari Raya

This app is designed to help Malaysian families manage their "duit raya" distribution during Hari Raya celebrations. Duit raya is a traditional monetary gift given to children and unmarried individuals during the festive season.

---

**Happy Hari Raya! Selamat Hari Raya! 🎊**

Made with ❤️ for the Malaysian community and anyone celebrating the festive season.
