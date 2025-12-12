import { httpRouter } from 'convex/server';
import { authComponent, createAuth } from './auth';
import { httpAction } from './_generated/server';
import { resend } from './sendEmails';
import { polar } from './polar';

const http = httpRouter();
http.route({
  path: '/resend-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, req) => {
    return await resend.handleResendEventWebhook(ctx, req);
  }),
});
polar.registerRoutes(http, {
  // Optional custom path, default is "/polar/events"
  path: '/polar/events',
  // Optional callback for when a subscription is updated
  onSubscriptionUpdated: async (ctx, event) => {
    console.log('Subscription updated', event);
    if (event.data.customerCancellationReason) {
      console.log(
        'Customer cancellation reason',
        event.data.customerCancellationReason
      );
      console.log(
        'Customer cancellation comment',
        event.data.customerCancellationComment
      );
    }
    // This callback is run in an Action, so you could pipe this customer
    // cancellation reason to another service, for example.
  },
  // Other available callbacks:
  onSubscriptionCreated: undefined,
  onProductCreated: undefined,
  onProductUpdated: undefined,
});

authComponent.registerRoutes(http, createAuth);

export default http;
