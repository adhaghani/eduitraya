"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

interface AppHeaderProps {
  onBackToLanding?: () => void;
}

export function AppHeader({ onBackToLanding }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {onBackToLanding && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToLanding}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl">💰 eDuit Raya Splitter</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span>All data stored locally</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
}
