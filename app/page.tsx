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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRecipients } from "@/hooks/useRecipients";
import { AddRecipientForm } from "@/components/AddRecipientForm";
import { RecipientsList } from "@/components/RecipientsList";
import { ExportPage } from "@/components/ExportPage";
import { StatsOverview } from "@/components/StatsOverview";
import { QuickActions } from "@/components/QuickActions";
import { DataManagement } from "@/components/DataManagement";
import { LandingPage } from "@/components/LandingPage";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import {
  Users,
  DollarSign,
  Plus,
  List,
  Calculator,
  Gift,
} from "lucide-react";

export default function Home() {
  const { recipients, loading, totalAmount, totalRecipients } = useRecipients();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showApp, setShowApp] = useState(false);

  // Show landing page first
  if (!showApp) {
    return <LandingPage onGetStarted={() => setShowApp(true)} />;
  }

  if (loading) {
    return (
      <>
        <AppHeader onBackToLanding={() => setShowApp(false)} />
        <div className="container mx-auto p-6 flex-1">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Loading your duit raya data...
              </p>
            </div>
          </div>
        </div>
        <AppFooter />
      </>
    );
  }

  return (
    <>
      <AppHeader onBackToLanding={() => setShowApp(false)} />
      <main className="flex-1">
        <div className="container mx-auto p-6 space-y-6">
          {/* Hero Section */}
          <div className="text-center py-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              <Gift className="inline-block mr-2 h-8 w-8 text-primary" />
              eDuit Raya Splitter
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track and manage your duit raya distribution with ease. Add
              recipients, track amounts, and export your data.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Recipients
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRecipients}</div>
                <p className="text-xs text-muted-foreground">
                  {totalRecipients === 0
                    ? "No recipients yet"
                    : "People receiving duit raya"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Amount
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  RM {totalAmount.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalAmount === 0
                    ? "No amount distributed yet"
                    : "Total duit raya distributed"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Amount
                </CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  RM{" "}
                  {totalRecipients > 0
                    ? (totalAmount / totalRecipients).toFixed(2)
                    : "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average per recipient
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="add">Add Recipient</TabsTrigger>
              <TabsTrigger value="list">Recipients List</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overview Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard Overview</CardTitle>
                    <CardDescription>
                      Quick overview of your duit raya distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {totalRecipients === 0 ? (
                      <div className="text-center py-8">
                        <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No recipients added yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Start by adding your first recipient to track your
                          duit raya distribution.
                        </p>
                        <Button onClick={() => setActiveTab("add")}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add First Recipient
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            Recent Recipients
                          </h3>
                          <Badge variant="secondary">
                            {totalRecipients} total
                          </Badge>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          {recipients.slice(0, 5).map((recipient) => (
                            <div
                              key={recipient.id}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{recipient.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {recipient.note}
                                </p>
                              </div>
                              <Badge variant="outline">
                                RM {recipient.amount.toFixed(2)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        {totalRecipients > 5 && (
                          <div className="text-center pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setActiveTab("list")}
                            >
                              <List className="mr-2 h-4 w-4" />
                              View All Recipients
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div>
                  <QuickActions onAddRecipient={() => setActiveTab("add")} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="add">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Recipient</CardTitle>
                  <CardDescription>
                    Add a new person to your duit raya distribution list
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AddRecipientForm onSuccess={() => setActiveTab("list")} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>Recipients List</CardTitle>
                  <CardDescription>
                    Manage your duit raya recipients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecipientsList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Statistics & Analytics</CardTitle>
                  <CardDescription>
                    Detailed analysis of your duit raya distribution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StatsOverview />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export">
              <Card>
                <CardHeader>
                  <CardTitle>Export Data</CardTitle>
                  <CardDescription>
                    Export your duit raya distribution data as PDF or CSV
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExportPage />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data">
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>
                    Backup, restore, and manage your eDuit Raya data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataManagement />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <AppFooter />
    </>
  );
}
