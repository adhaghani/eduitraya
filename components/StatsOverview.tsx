"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecipients } from "@/hooks/useRecipients";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calculator,
  Calendar,
  Target,
  Percent,
} from "lucide-react";

export function StatsOverview() {
  const { recipients, totalAmount, totalRecipients } = useRecipients();

  // Calculate various statistics
  const averageAmount = totalRecipients > 0 ? totalAmount / totalRecipients : 0;
  const maxAmount =
    recipients.length > 0 ? Math.max(...recipients.map((r) => r.amount)) : 0;
  const minAmount =
    recipients.length > 0 ? Math.min(...recipients.map((r) => r.amount)) : 0;

  // Group recipients by amount ranges
  const amountRanges = {
    low: recipients.filter((r) => r.amount <= 20).length,
    medium: recipients.filter((r) => r.amount > 20 && r.amount <= 100).length,
    high: recipients.filter((r) => r.amount > 100).length,
  };

  // Recent additions (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentAdditions = recipients.filter(
    (r) => new Date(r.dateAdded) >= sevenDaysAgo
  ).length;

  // Most common amount
  const amountCounts = recipients.reduce((acc, recipient) => {
    acc[recipient.amount] = (acc[recipient.amount] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const mostCommonAmount = Object.entries(amountCounts).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0];

  const stats = [
    {
      title: "Total Recipients",
      value: totalRecipients,
      icon: Users,
      description: "People in your distribution list",
      trend: recentAdditions > 0 ? "up" : "neutral",
      trendValue: `+${recentAdditions} this week`,
    },
    {
      title: "Total Amount",
      value: `RM ${totalAmount.toFixed(2)}`,
      icon: DollarSign,
      description: "Total duit raya distributed",
      trend: "neutral",
    },
    {
      title: "Average Amount",
      value: `RM ${averageAmount.toFixed(2)}`,
      icon: Calculator,
      description: "Average per recipient",
      trend: "neutral",
    },
    {
      title: "Highest Amount",
      value: `RM ${maxAmount.toFixed(2)}`,
      icon: TrendingUp,
      description: "Largest single distribution",
      trend: "up",
    },
    {
      title: "Lowest Amount",
      value: `RM ${minAmount.toFixed(2)}`,
      icon: TrendingDown,
      description: "Smallest single distribution",
      trend: "down",
    },
    {
      title: "Most Common Amount",
      value: mostCommonAmount
        ? `RM ${parseFloat(mostCommonAmount).toFixed(2)}`
        : "N/A",
      icon: Target,
      description: "Most frequently given amount",
      trend: "neutral",
    },
  ];

  if (recipients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistics Overview</CardTitle>
          <CardDescription>
            Your duit raya distribution statistics will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Add some recipients to see your statistics
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              {stat.trendValue && (
                <div className="flex items-center mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {stat.trendValue}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Distribution Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Amount Distribution Analysis
          </CardTitle>
          <CardDescription>
            Breakdown of recipients by amount ranges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {amountRanges.low}
              </div>
              <p className="text-sm font-medium">Low Range</p>
              <p className="text-xs text-muted-foreground">RM 1 - RM 20</p>
              <div className="mt-2">
                <Badge variant="outline">
                  {totalRecipients > 0
                    ? ((amountRanges.low / totalRecipients) * 100).toFixed(1)
                    : 0}
                  %
                </Badge>
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {amountRanges.medium}
              </div>
              <p className="text-sm font-medium">Medium Range</p>
              <p className="text-xs text-muted-foreground">RM 21 - RM 100</p>
              <div className="mt-2">
                <Badge variant="outline">
                  {totalRecipients > 0
                    ? ((amountRanges.medium / totalRecipients) * 100).toFixed(1)
                    : 0}
                  %
                </Badge>
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {amountRanges.high}
              </div>
              <p className="text-sm font-medium">High Range</p>
              <p className="text-xs text-muted-foreground">RM 100+</p>
              <div className="mt-2">
                <Badge variant="outline">
                  {totalRecipients > 0
                    ? ((amountRanges.high / totalRecipients) * 100).toFixed(1)
                    : 0}
                  %
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest recipients added to your list
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recipients.length > 0 ? (
            <div className="space-y-3">
              {recipients
                .sort(
                  (a, b) =>
                    new Date(b.dateAdded).getTime() -
                    new Date(a.dateAdded).getTime()
                )
                .slice(0, 5)
                .map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{recipient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Added on{" "}
                        {new Date(recipient.dateAdded).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge>RM {recipient.amount.toFixed(2)}</Badge>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No recent activity
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
