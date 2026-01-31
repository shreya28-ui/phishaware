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
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div>
        <h2 className="text-xl font-bold tracking-tight">Campaign not found</h2>
        <p className="text-muted-foreground mt-2">
          Could not find a campaign with ID: {id}
        </p>
      </div>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2">
          <CardTitle className="text-2xl sm:text-3xl break-words">{campaign.name}</CardTitle>
          <CardDescription>
            Campaign performance overview. Scheduled for:{' '}
            {campaign.scheduledTime
              ? format((campaign.scheduledTime as Timestamp).toDate(), 'PPP')
              : 'N/A'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <YAxis dataKey="value" allowDecimals={false} hide={user ? false : true} />
              <XAxis
                dataKey="metric"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="value" fill="var(--color-value)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Participants & Tracking Links</CardTitle>
          <CardDescription>
            This campaign was sent to {campaign.sent || 0} participant(s).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {phishingEmails && phishingEmails.length > 0 ? (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Participant Email</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {phishingEmails.map((email) => (
                      <TableRow key={email.id}>
                        <TableCell className="font-medium">{email.participantEmail}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setPreviewEmail(email)}
                              title="Preview"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => copyToClipboard(getTrackingLink(email.id))}
                              title="Copy Link"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No participants found for this campaign.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!previewEmail} onOpenChange={(isOpen) => !isOpen && setPreviewEmail(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Preview: {selectedTemplate?.subject}</DialogTitle>
            <DialogDescription>
              This is a preview of the email sent to {previewEmail?.participantEmail}.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 rounded-md border bg-background p-6 text-sm">
            <div className="grid gap-2">
              <p><span className="font-semibold">From:</span> The Security Team &lt;noreply@example-security.com&gt;</p>
              <p><span className="font-semibold">To:</span> {previewEmail?.participantEmail}</p>
              <p><span className="font-semibold">Subject:</span> {selectedTemplate?.subject}</p>
            </div>
            <hr className="my-4" />
            <div dangerouslySetInnerHTML={{ __html: previewEmail && selectedTemplate ? selectedTemplate.body(getTrackingLink(previewEmail.id)) : '' }} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
