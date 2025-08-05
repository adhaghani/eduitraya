"use client";

import { Heart } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">💰 eDuit Raya Splitter</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Making Hari Raya celebrations more organized and enjoyable for
              Malaysian families.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Track recipients & amounts</li>
              <li>• Generate DuitNow QR codes</li>
              <li>• Export to PDF & Excel</li>
              <li>• Local data storage</li>
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <h4 className="font-semibold">Information</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• No registration required</li>
              <li>• Works offline</li>
              <li>• Your data stays private</li>
              <li>• Mobile-friendly design</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            Built with <Heart className="h-4 w-4 text-red-500" /> for the
            Malaysian community
            <span className="mx-2">•</span>
            Selamat Hari Raya Aidilfitri! 🎉
          </p>
        </div>
      </div>
    </footer>
  );
}
