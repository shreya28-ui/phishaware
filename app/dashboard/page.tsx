'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { CampaignsTable } from "@/components/dashboard/campaigns-table";
import { PageTransition, FadeIn } from "@/components/ui/animations";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your security campaigns.</p>
          </div>
          <div className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild className="w-full sm:w-auto shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40">
                <Link href="/dashboard/campaigns/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Campaign
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        <FadeIn delay={0.2}>
          <Card className="border-none shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Recent Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <CampaignsTable />
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
