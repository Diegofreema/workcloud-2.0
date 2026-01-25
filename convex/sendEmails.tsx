'use node';
import { Resend } from '@convex-dev/resend';
import { pretty, render } from '@react-email/render';
import { v } from 'convex/values';
import React from 'react';
import { components, internal } from './_generated/api';
import { internalAction } from './_generated/server';
import WorkcloudAdminEmailTemplate from './email/newOrganizationEmail';
import WelcomeEmail from './email/welcomeEmail';
import NewOrganizationCreatedEmail from './email/newOrganisationCreated';

export const resend: Resend = new Resend(components.resend, {
  testMode: false,
  webhookSecret: process.env.RESEND_WEBHOOK_SECRET ?? '',
  apiKey: process.env.RESEND_API_KEY ?? '',
  onEmailEvent: internal.handleEmail.handleEmailEvent,
});

export const sendWelcomeEmail = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const html = await pretty(await render(<WelcomeEmail name={args.name} />));
    await resend.sendEmail(ctx, {
      from: 'Support <workcloud@workcloud-backend.xyz>',
      to: args.email,
      subject: 'Hi there',
      html,
    });
  },
});

export const sendNewOrgEmail = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const html = await pretty(
      await render(<WorkcloudAdminEmailTemplate name={args.name} />),
    );
    await resend.sendEmail(ctx, {
      from: 'Support <workcloud@workcloud-backend.xyz>',
      to: args.email,
      subject: 'Hi there',
      html,
    });
  },
});
export const sendNewOrgEmailToOthers = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
    image: v.string(),
    description: v.string(),
    address: v.string(),
  },
  handler: async (ctx, args) => {
    const html = await pretty(
      await render(
        <NewOrganizationCreatedEmail
          orgName={args.name}
          imageUrl={args.image}
          description={args.description}
          address={args.address}
          email={args.email}
        />,
      ),
    );
    await resend.sendEmail(ctx, {
      from: 'Support <workcloud@workcloud-backend.xyz>',
      to: args.email,
      subject: 'New Organization created',
      html,
    });
  },
});
