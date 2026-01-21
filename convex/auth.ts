import {
  type AuthFunctions,
  createClient,
  type GenericCtx,
} from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { betterAuth, type BetterAuthOptions } from 'better-auth/minimal';
import { expo } from '@better-auth/expo';
import { components, internal } from './_generated/api';
import { DataModel } from './_generated/dataModel';
import { query } from './_generated/server';
import authConfig from './auth.config';
import authSchema from './betterAuth/schema';

const authFunctions: AuthFunctions = internal.auth;
// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    authFunctions,
    triggers: {
      user: {
        onCreate: async (ctx, doc) => {
          await ctx.db.insert('users', {
            userId: doc._id,
            name: doc.name,
            email: doc.email,
            image: doc.image as string,
          });
        },
      },
    },
    local: {
      schema: authSchema,
    },
  }
);
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
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
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    socialProviders: {
      google: {
        clientId: process.env.AUTH_GOOGLE_ID as string,
        clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
      },
      apple: {
        clientId: process.env.AUTH_APPLE_ID as string,
        clientSecret: process.env.AUTH_APPLE_SECRET as string,
      },
    },
    account: {
      accountLinking: {
        enabled: true,
      },
    },

    plugins: [
      // The Expo and Convex plugins are required
      expo(),
      convex({ authConfig }),
    ],
    user: {
      additionalFields: {
        streamToken: {
          required: false,
          type: 'string',
        },
      },
    },
  } satisfies BetterAuthOptions;
};

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};
// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();
