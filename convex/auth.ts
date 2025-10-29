import { convexAuth } from '@convex-dev/auth/server';
import Google from '@auth/core/providers/google';
import Apple from '@auth/core/providers/apple';

import { MutationCtx } from './_generated/server';
import { findUserByEmail } from './users';
import { internal } from './_generated/api';
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google,
    Apple({
      profile: (appleInfo) => {
        const name = appleInfo.user
          ? `${appleInfo.user.name.firstName} ${appleInfo.user.name.lastName}`
          : undefined;
        return {
          id: appleInfo.sub,
          name: name,
          email: appleInfo.email,
        };
      },
    }),
  ],
  callbacks: {
    // `args.type` is one of "oauth" | "email" | "phone" | "credentials" | "verification"
    // `args.provider` is the currently used provider config
    async createOrUpdateUser(ctx: MutationCtx, args) {
      console.log({ args: args.profile });
      if (args.existingUserId) {
        // Optionally merge updated fields into the existing user object here
        return args.existingUserId;
      }

      // Implement your own account linking logic:
      const existingUser = await findUserByEmail(
        ctx,
        args.profile.email as string
      );

      if (existingUser) return existingUser._id;

      // Implement your own user creation:
      const userId = ctx.db.insert('users', {
        email: args.profile.email as string,
        name: args.profile.name as string,
        image: args.profile.picture as string,
        emailVerificationTime: args.profile.emailVerificationTime as number,
        phoneNumber: args.profile.phone as string,
      });

      await ctx.scheduler.runAfter(0, internal.sendEmails.sendWelcomeEmail, {
        name: args.profile.name as string,
        email: args.profile.email as string,
      });

      return userId;
    },
  },
});
