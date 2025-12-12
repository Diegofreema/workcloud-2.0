import { createClient, type GenericCtx } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { betterAuth } from 'better-auth';
import { expo } from '@better-auth/expo';
import { components } from './_generated/api';
import { DataModel } from './_generated/dataModel';
import { query } from './_generated/server';
import authSchema from './betterAuth/schema';
// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: {
      schema: authSchema,
    },
  }
);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    trustedOrigins: [
      'workcloud://',
      'https://appleid.apple.com',
      ...(process.env.NODE_ENV === 'development'
        ? [
            'exp://*/*', // Trust all Expo development URLs
            'exp://10.0.0.*:*/*', // Trust 10.0.0.x IP range
            'exp://192.168.*.*:*/*', // Trust 192.168.x.x IP range
            'exp://172.*.*.*:*/*', // Trust 172.x.x.x IP range
            'exp://localhost:*/*', // Trust localhost
          ]
        : []),
    ],
    database: authComponent.adapter(ctx),

    socialProviders: {
      google: {
        clientId: process.env.AUTH_GOOGLE_ID!,
        clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      },
      apple: {
        clientId: process.env.AUTH_APPLE_ID!,
        clientSecret: process.env.AUTH_APPLE_SECRET!,
      },
    },
    plugins: [
      // The Expo and Convex plugins are required
      expo(),
      convex(),
    ],
    user: {
      additionalFields: {
        storageId: {
          type: 'string',
          required: false,
          defaultValue: '',
        },
        organizationId: {
          type: 'string',
          required: false,
          defaultValue: '',
        },
        workerId: {
          type: 'string',
          required: false,
          defaultValue: '',
        },
        pushToken: {
          type: 'string',
          required: false,
          defaultValue: '',
        },
        streamToken: {
          type: 'string',
          required: false,
          defaultValue: '',
        },
        isOnline: {
          type: 'boolean',
          required: false,
          defaultValue: false,
        },
        lastSeen: {
          type: 'string',
          required: false,
          defaultValue: '',
        },
        date_of_birth: {
          type: 'string',
          required: false,
          defaultValue: '',
        },
      },
    },
  });
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});
