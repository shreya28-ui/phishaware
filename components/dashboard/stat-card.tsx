import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
};

import { motion } from "framer-motion";

export function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="border-none shadow-lg bg-gradient-to-br from-card to-card/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Icon className="h-12 w-12" />
        </div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold tracking-tight"
          >
            {value}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
