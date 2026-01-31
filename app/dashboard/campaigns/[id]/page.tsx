'use client';

import { useState } from 'react';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Copy, Eye } from 'lucide-react';
import Link from 'next/link';
import type { PhishingCampaign, ParticipantList, PhishingEmail } from '@/lib/types';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { emailTemplates } from '@/lib/email-templates';
import { useParams } from 'next/navigation';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';


import { PageTransition, FadeIn, StaggerChildren } from "@/components/ui/animations";
import { motion, AnimatePresence } from "framer-motion";

export default function CampaignDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [previewEmail, setPreviewEmail] = useState<PhishingEmail | null>(null);

  const campaignDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'admins', user.uid, 'phishingCampaigns', id);
  }, [user, firestore, id]);

  const { data: campaign, isLoading: campaignLoading } =
    useDoc<PhishingCampaign>(campaignDocRef);

  const participantListDocRef = useMemoFirebase(() => {
    if (!campaign || !user || !firestore) return null;
    return doc(
      firestore,
      'admins',
      user.uid,
      'participantLists',
      campaign.participantListId
    );
  }, [campaign, user, firestore]);

  const { data: participantList, isLoading: listLoading } =
    useDoc<ParticipantList>(participantListDocRef);

  const phishingEmailsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'admins', user.uid, 'phishingCampaigns', id, 'phishingEmails');
  }, [user, firestore, id]);

  const { data: phishingEmails, isLoading: emailsLoading } = useCollection<PhishingEmail>(phishingEmailsQuery);

  // Use denormalized stats directly from the campaign document
  // These are updated by the API when interactions are recorded
  const stats = {
    clicked: campaign?.clicked || 0,
    submitted: campaign?.submitted || 0,
  };

  const isLoading = campaignLoading || listLoading || emailsLoading;

  const getTrackingLink = (emailId: string) => {
    if (!user || !campaign) return '';
    const trackingData = { a: user.uid, c: campaign.id, e: emailId };
    const encoded = btoa(JSON.stringify(trackingData));
    return `${window.location.origin}/api/interact?q=${encoded}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const selectedTemplate = campaign ? emailTemplates.get(campaign.emailTemplate) : null;

  if (isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <PageTransition>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold tracking-tight">Campaign not found</h2>
          <p className="text-muted-foreground mt-2">
            Could not find a campaign with ID: {id}
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </PageTransition>
    );
  }

  const chartData = [
    { metric: 'Sent', value: campaign.sent || 0 },
    { metric: 'Clicked', value: stats.clicked },
    { metric: 'Submitted', value: stats.submitted },
  ];

  const chartConfig = {
    value: {
      label: 'Users',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

  return (
    <PageTransition>
      <div className="space-y-6">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <Button variant="outline" size="sm" asChild className="hover:bg-primary hover:text-primary-foreground transition-colors">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
        </motion.div>

        <StaggerChildren>
          <div className="grid gap-6">
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}>
              <Card className="border-none shadow-xl bg-gradient-to-br from-card to-secondary/10">
                <CardHeader className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                      {campaign.name}
                    </CardTitle>
                    <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
                      {campaign.status}
                    </div>
                  </div>
                  <CardDescription>
                    Scheduled for:{' '}
                    <span className="text-foreground font-medium">
                      {campaign.scheduledTime
                        ? format((campaign.scheduledTime as Timestamp).toDate(), 'PPP')
                        : 'N/A'}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="min-h-[300px] w-full"
                  >
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                        <YAxis dataKey="value" allowDecimals={false} hide={user ? false : true} />
                        <XAxis
                          dataKey="metric"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <ChartTooltip
                          cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                          dataKey="value"
                          fill="var(--color-value)"
                          radius={[6, 6, 0, 0]}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ChartContainer>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <Card className="border-none shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl">Participants & Tracking Links</CardTitle>
                  <CardDescription>
                    Direct tracking links generated for {phishingEmails?.length || 0} secure simulations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {phishingEmails && phishingEmails.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden"
                      >
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="min-w-[200px] font-bold">Participant Email</TableHead>
                                <TableHead className="text-right font-bold">Interaction Tools</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {phishingEmails.map((email, idx) => (
                                <motion.tr
                                  key={email.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className="group transition-colors hover:bg-muted/30"
                                >
                                  <TableCell className="font-medium">{email.participantEmail}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="h-8 w-8 rounded-full border-primary/20 hover:border-primary hover:bg-primary/5 text-primary"
                                          onClick={() => setPreviewEmail(email)}
                                          title="Preview Email"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </motion.div>
                                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <Button
                                          variant="secondary"
                                          size="icon"
                                          className="h-8 w-8 rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                                          onClick={() => copyToClipboard(getTrackingLink(email.id))}
                                          title="Copy Link"
                                        >
                                          <Copy className="h-4 w-4" />
                                        </Button>
                                      </motion.div>
                                    </div>
                                  </TableCell>
                                </motion.tr>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-muted-foreground italic bg-muted/20 rounded-xl"
                      >
                        No participants indexed for this security simulation.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </StaggerChildren>

        <AnimatePresence>
          {previewEmail && (
            <Dialog open={!!previewEmail} onOpenChange={(isOpen) => !isOpen && setPreviewEmail(null)}>
              <DialogContent className="sm:max-w-2xl border-none shadow-2xl p-0 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                >
                  <DialogHeader className="p-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                    <DialogTitle className="text-xl">Email Simulation: {selectedTemplate?.subject}</DialogTitle>
                    <DialogDescription className="text-primary-foreground/80">
                      Live preview of the phish for {previewEmail?.participantEmail}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-6 space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50 border space-y-2 text-sm">
                      <p><span className="font-bold text-primary">From:</span> Security Operations &lt;noreply@security-drill.com&gt;</p>
                      <p><span className="font-bold text-primary">To:</span> {previewEmail?.participantEmail}</p>
                      <p><span className="font-bold text-primary">Subject:</span> {selectedTemplate?.subject}</p>
                    </div>
                    <div
                      className="p-8 rounded-xl border-dashed border-2 bg-white text-zinc-900 shadow-inner min-h-[200px]"
                      dangerouslySetInnerHTML={{ __html: previewEmail && selectedTemplate ? selectedTemplate.body(getTrackingLink(previewEmail.id)) : '' }}
                    />
                  </div>
                  <div className="p-4 bg-muted/30 flex justify-end">
                    <Button onClick={() => setPreviewEmail(null)}>Close Preview</Button>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
