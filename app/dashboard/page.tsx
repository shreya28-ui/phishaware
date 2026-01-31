import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { CampaignsTable } from "@/components/dashboard/campaigns-table";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | PhishAware',
  description: 'Admin dashboard for PhishAware.',
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/campaigns/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Campaign
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignsTable />
        </CardContent>
      </Card>
    </div>
  );
}
