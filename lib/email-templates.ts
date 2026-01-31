'use client';

export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: (trackingLink: string) => string;
};

const templates: EmailTemplate[] = [
  {
    id: 'password-reset',
    name: 'Password Reset',
    subject: 'Action Required: Password Reset Request',
    body: (trackingLink: string) => `
      <div>
        <p>Hello,</p>
        <p>We received a request to reset the password for your account. If you did not make this request, please ignore this email.</p>
        <p>To reset your password, please click the link below:</p>
        <p><a href="${trackingLink}" style="color: #2563EB; text-decoration: underline;">Reset Your Password</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>Thank you,<br/>The Security Team</p>
      </div>
    `,
  },
  {
    id: 'prize-alert',
    name: 'Prize Alert',
    subject: "Congratulations! You've Won a Prize!",
    body: (trackingLink: string) => `
      <div>
        <p>Dear Valued Customer,</p>
        <p>You have been selected as a winner in our monthly giveaway! To claim your prize, you must verify your account details immediately.</p>
        <p>Click the link below to claim your reward:</p>
        <p><a href="${trackingLink}" style="color: #2563EB; text-decoration: underline;">Claim Your Prize Now</a></p>
        <p>Hurry, this is a limited-time offer!</p>
        <p>Sincerely,<br/>The Rewards Team</p>
      </div>
    `,
  },
  {
    id: 'account-alert',
    name: 'Account Alert',
    subject: 'Security Alert: Unusual Sign-In Detected',
    body: (trackingLink: string) => `
      <div>
        <p>We detected an unusual sign-in to your account from a new device. If this was not you, please secure your account immediately.</p>
        <p><strong>Location:</strong> Vyshneve, Kyiv Oblast, Ukraine</p>
        <p>If you don't recognize this activity, please click here to review your account and secure it:</p>
        <p><a href="${trackingLink}" style="color: #2563EB; text-decoration: underline;">Review Sign-In Activity</a></p>
        <p>Thank you,<br/>Account Security Team</p>
      </div>
    `,
  },
  {
    id: 'document-share',
    name: 'Document Share',
    subject: 'A document has been shared with you',
    body: (trackingLink: string) => `
      <div>
        <p>Hello,</p>
        <p>A document titled "Q4 Financial Projections" has been shared with you. Please review it at your earliest convenience.</p>
        <p>You can view the document by clicking the link below:</p>
        <p><a href="${trackingLink}" style="color: #2563EB; text-decoration: underline;">Open Document</a></p>
        <p>This document is confidential.</p>
        <p>Best regards,<br/>Your Team</p>
      </div>
    `,
  }
];

export const emailTemplates = new Map(templates.map(t => [t.id, t]));
