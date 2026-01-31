'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useState } from 'react';
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, writeBatch, doc } from 'firebase/firestore';


const formSchema = z.object({
  campaignName: z.string().min(2, "Campaign name must be at least 2 characters."),
  template: z.string({ required_error: "Please select an email template." }),
  participants: z.string().min(1, "Participant list cannot be empty.").refine(
    (value) => value.split('\n').filter(line => line.trim() !== '').every(line => z.string().email().safeParse(line.trim()).success),
    {
      message: "Please enter a list of valid email addresses, one per line.",
    }
  ),
  sendDate: z.date({ required_error: "A send date is required." }),
});

export function NewCampaignForm() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campaignName: "",
      participants: "",
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to create a campaign.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const emails = values.participants.split('\n').map(e => e.trim()).filter(e => e);

      const batch = writeBatch(firestore);

      // 1. Create Participant List
      const participantListCollectionRef = collection(firestore, 'admins', user.uid, 'participantLists');
      const participantListDocRef = doc(participantListCollectionRef); // generate new doc ref
      batch.set(participantListDocRef, {
        name: `${values.campaignName} - Participants`,
        emails: emails,
        adminId: user.uid,
      });

      // 2. Create Phishing Campaign
      const campaignCollectionRef = collection(firestore, 'admins', user.uid, 'phishingCampaigns');
      const campaignDocRef = doc(campaignCollectionRef); // generate new doc ref
      batch.set(campaignDocRef, {
        id: campaignDocRef.id,
        name: values.campaignName,
        emailTemplate: values.template,
        participantListId: participantListDocRef.id,
        scheduledTime: values.sendDate,
        status: 'scheduled',
        adminId: user.uid,
        sent: emails.length,
        clicked: 0,
        submitted: 0,
      });

      // 3. Create PhishingEmail docs for each participant
      const phishingEmailsCollectionRef = collection(firestore, 'admins', user.uid, 'phishingCampaigns', campaignDocRef.id, 'phishingEmails');
      for (const email of emails) {
        const phishingEmailDocRef = doc(phishingEmailsCollectionRef); // generate new doc ref
        batch.set(phishingEmailDocRef, {
          id: phishingEmailDocRef.id,
          phishingCampaignId: campaignDocRef.id,
          participantEmail: email,
          sentTime: serverTimestamp(),
          deliveryStatus: 'sent', // Simulating sent status
        });
      }

      await batch.commit();

      toast({
        title: "Campaign Scheduled!",
        description: `Campaign "${values.campaignName}" has been scheduled for ${format(values.sendDate, "PPP")}.`,
      });
      form.reset();
      router.push('/dashboard');

    } catch (error) {
      console.error("Campaign creation failed:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem creating your campaign.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="campaignName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="Q4 Security Drill" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormDescription>A public name for this campaign.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Template</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a phishing template" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="password-reset">Password Reset</SelectItem>
                  <SelectItem value="prize-alert">Prize Alert</SelectItem>
                  <SelectItem value="account-alert">Account Alert</SelectItem>
                  <SelectItem value="document-share">Document Share</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Participant Emails</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste a list of emails, one per line."
                  className="min-h-[150px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Enter one email address per line.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sendDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Schedule</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full sm:w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The date the phishing emails will be sent.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Schedule Campaign
        </Button>
      </form>
    </Form>
  );
}
