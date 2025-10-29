import {Polar} from "@convex-dev/polar";
import {api, components} from "./_generated/api";
import {Id} from "./_generated/dataModel";
import {action, query} from "./_generated/server";

export const getUserInfo = query({
    args: {},
    handler: async (ctx) => {
        // This would be replaced with an actual auth query,
        // eg., ctx.auth.getUserIdentity() or getAuthUserId(ctx)
        const user = await ctx.db.query("users").first();
        if (!user) {
            throw new Error("User not found");
        }
        return {
            ...user,
            email: user.email || ''
        };
    },
});

export const polar = new Polar(components.polar, {
    products: {
        businessPlan: "96642f38-6848-4216-874e-3a98013a6bed",
        businessPlanYearly: "e9736d3f-a248-4f79-9887-f62a62c72001",
        businessPlanPro: "468591c2-2394-450e-9161-d1579c481753",
        businessPlanProYearly: "045089e5-603c-48c5-bd78-62c0704609cd",
        enterprisePlan: "de08942d-b686-42de-b631-53d139b52d71",
        enterprisePlanYearly: "235688d5-3469-4a46-a7f3-1faa2dffbf8f",
    },
    getUserInfo: async (ctx) => {
        const user: { _id: Id<"users">; email: string } = await ctx.runQuery(
            api.polar.getUserInfo
        );
        console.log(user._id, user.email)
        return {
            userId: user._id,
            email: user.email,
        };
    },

    organizationToken: process.env.POLAR_ORGANIZATION_TOKEN,
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
    server: process.env.POLAR_SERVER,
});

export const {
    changeCurrentSubscription,
    cancelCurrentSubscription,
    getConfiguredProducts,
    listAllProducts,
    generateCheckoutLink,
    generateCustomerPortalUrl,
} = polar.api();

export const syncProducts = action({
    args: {},
    handler: async (ctx) => {
        await polar.syncProducts(ctx);
    },
});
