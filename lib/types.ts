import type { Timestamp } from 'firebase/firestore';

export type PhishingCampaign = {
  id: string;
  adminId: string;
  name: string;
  emailTemplate: string;
  participantListId: string;
  scheduledTime: Timestamp;
  status: 'scheduled' | 'running' | 'completed' | 'archived';
  sent: number;
  clicked: number;
  submitted: number;
};

export type ParticipantList = {
    id: string;
    name: string;
    emails: string[];
    adminId: string;
};

export type PhishingEmail = {
  id: string;
  phishingCampaignId: string;
  participantEmail: string;
  sentTime: Timestamp;
  deliveryStatus: string;
};

export type UserInteraction = {
  id: string;
  adminId: string;
  phishingEmailId: string;
  phishingCampaignId: string;
  interactionType: 'link click' | 'submitted data';
  interactionTime: Timestamp;
};

    
