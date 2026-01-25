import { Polar } from '@convex-dev/polar';
import { api, components } from './_generated/api';
import { Id } from './_generated/dataModel';
import { action, internalAction, query } from './_generated/server';
import { getLoggedInUser } from './users';
import { ConvexError, v } from 'convex/values';

export const getUserInfo = query({
  args: {},
  handler: async (ctx) => {
    const user = await getLoggedInUser(ctx, 'query');
    if (!user) {
      throw new ConvexError({ message: 'User not found' });
    }
    return {
      ...user,
      email: user.email || '',
    };
  },
});

export const polar = new Polar(components.polar, {
  products: {
    businessPlan: '96642f38-6848-4216-874e-3a98013a6bed',
    businessPlanYearly: '1e9ccbce-d011-4372-ad6d-e91faba44cec',
    businessPlanPro: '41ce08a4-f7fc-4889-8ea4-9c2200fd5ba5',
    businessPlanProYearly: '7db5ec49-d677-46a4-b087-2d86f80b7406',
    enterprisePlan: '63b75623-171f-45ea-a9d6-716d5eeb021e',
    enterprisePlanYearly: 'e51f4fa8-1809-4773-84b4-31cd9345a885',
  },
  getUserInfo: async (ctx) => {
    const user: { _id: Id<'users'>; email: string } = await ctx.runQuery(
      api.polar.getUserInfo,
    );

    return {
      userId: user._id,
      email: user.email,
    };
  },

  organizationToken: process.env.POLAR_ORGANIZATION_TOKEN,
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
});

export const {
  changeCurrentSubscription,
  cancelCurrentSubscription,
  getConfiguredProducts,
  listAllProducts,
  generateCheckoutLink,
  generateCustomerPortalUrl,
} = polar.api();

export const syncProducts = internalAction({
  args: {},
  handler: async (ctx) => {
    console.log('Running');
    try {
      await polar.syncProducts(ctx);
    } catch (error) {
      console.log(error);
    }
  },
});

// export const startCheckout = action({
//   args: {
//     productIds: v.array(v.string()),

//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       throw new ConvexError({ message: 'Unauthorized' });
//     }
//    const url = await generateCheckoutLink(ctx, {
//     productIds: args.productIds,

//    })
//   }
// })
