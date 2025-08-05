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
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Users,
  Calculator,
  QrCode,
  Download,
  Shield,
  Smartphone,
  CheckCircle,
  ArrowRight,
  Banknote,
  Star,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Track Recipients",
      description:
        "Easily manage and organize all your duit raya recipients in one place.",
    },
    {
      icon: <Calculator className="h-8 w-8 text-blue-600" />,
      title: "Amount Management",
      description:
        "Keep track of amounts given to each recipient with detailed notes.",
    },
    {
      icon: <QrCode className="h-8 w-8 text-purple-600" />,
      title: "DuitNow QR Codes",
      description: "Generate payment QR codes for recipients with DuitNow IDs.",
    },
    {
      icon: <Download className="h-8 w-8 text-orange-600" />,
      title: "Export Data",
      description:
        "Export your data to PDF or Excel for record keeping and sharing.",
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Local Storage",
      description:
        "Your data stays private and secure on your device - no cloud required.",
    },
    {
      icon: <Smartphone className="h-8 w-8 text-indigo-600" />,
      title: "Mobile Friendly",
      description:
        "Works perfectly on all devices - desktop, tablet, and mobile.",
    },
  ];

  const benefits = [
    "Never forget who you've given duit raya to",
    "Track total spending during festive season",
    "Generate professional receipts and reports",
    "Share QR codes for easy digital payments",
    "Backup and restore your data anytime",
    "No registration or personal data required",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            💰 eDuit Raya
            <span className="block text-green-600">Splitter</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            The smartest way to track and manage your duit raya distribution
            during the festive season. Keep organized, stay within budget, and
            make the celebration stress-free!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <div className="flex items-center text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              No signup required • Works offline
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">Free to Use</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                Private
              </div>
              <div className="text-gray-600">Local Storage</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                Easy
              </div>
              <div className="text-gray-600">Setup in Minutes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Duit Raya Management
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From tracking recipients to generating QR codes, we've got all the
              tools you need to make your Hari Raya celebration organized and
              memorable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-green-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose eDuit Raya Splitter?
              </h2>
              <p className="text-gray-600">
                Make your Hari Raya celebration more organized and enjoyable
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Organize Your Duit Raya?
            </h2>
            <p className="text-green-100 text-lg mb-8">
              Join thousands of families who are making their Hari Raya
              celebrations more organized and stress-free with eDuit Raya
              Splitter.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={onGetStarted}
              className="text-lg px-8 py-6 bg-white text-green-700 hover:bg-gray-50"
            >
              <Banknote className="mr-2 h-5 w-5" />
              Start Tracking Now
            </Button>
            <div className="mt-4 text-green-100 text-sm">
              ✨ Selamat Hari Raya Aidilfitri! ✨
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            Built with ❤️ for the Malaysian community. Happy celebrating! 🎉
          </p>
        </div>
      </div>
    </div>
  );
}
