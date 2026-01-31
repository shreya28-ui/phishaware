'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, Archive, Loader2, MoreHorizontal } from 'lucide-react';
import { useCollection, useUser, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, Timestamp, doc } from 'firebase/firestore';
import type { PhishingCampaign } from '@/lib/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export function CampaignsTable() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const campaignsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    // Reverted query to fix permissions error.
    // The where() clause was causing issues with the security rules.
    return query(
      collection(firestore, 'admins', user.uid, 'phishingCampaigns'),
      orderBy('scheduledTime', 'desc')
    );
  }, [user, firestore]);

  const { data: campaigns, isLoading, error } = useCollection<PhishingCampaign>(campaignsQuery);

  const getStatusVariant = (status: string): BadgeProps['variant'] => {
    switch (status) {
      case 'completed':
        return 'secondary';
      case 'running':
        return 'default';
      case 'scheduled':
        return 'outline';
      case 'archived':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const handleArchive = (campaignId: string) => {
    if (!user || !firestore) return;
    const campaignDocRef = doc(firestore, 'admins', user.uid, 'phishingCampaigns', campaignId);
    updateDocumentNonBlocking(campaignDocRef, { status: 'archived' });
    toast({
      title: 'Campaign Archived',
      description: 'The campaign has been removed from the main view.',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">Error loading campaigns: {error.message}</p>;
  }

  if (!campaigns || campaigns.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No active campaigns found.</p>;
  }

  const activeCampaigns = campaigns.filter(c => c.status !== 'archived');

  if (activeCampaigns.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No active campaigns found.</p>;
  }


  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Campaign</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Sent</TableHead>
              <TableHead className="hidden md:table-cell">Scheduled Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeCampaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium truncate max-w-[200px]">
                  {campaign.name}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(campaign.status)} className="capitalize">
                    {campaign.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {campaign.sent || 0}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {campaign.scheduledTime
                    ? format((campaign.scheduledTime as Timestamp).toDate(), 'PP')
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/campaigns/${campaign.id}`} className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleArchive(campaign.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
