import { internalMutation, MutationCtx } from './_generated/server';
import { query } from './betterAuth/_generated/server';
type ProductKey =
  | 'businessPlan'
  | 'businessPlanYearly'
  | 'businessPlanPro'
  | 'businessPlanProYearly'
  | 'enterprisePlan'
  | 'enterprisePlanYearly'
  | 'businessPlan2'
  | 'test'
  | undefined;

const PREMIUM_PLANS = new Set<ProductKey>([
  'businessPlan',
  'businessPlanYearly',
  'businessPlanPro',
  'businessPlanProYearly',
  'businessPlan2',
  'enterprisePlan',
  'enterprisePlanYearly',
  'test',
]);

export const isPremium = (key: ProductKey): boolean => PREMIUM_PLANS.has(key);

export const sendEmailAndPushNotificationsToEveryone = async (
  ctx: MutationCtx
) => {
  const users = await ctx.db.query('users');
};
