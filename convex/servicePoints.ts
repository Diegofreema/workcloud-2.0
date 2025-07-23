import { ConvexError, v } from 'convex/values';

import { Id } from './_generated/dataModel';
import { mutation, query, QueryCtx } from './_generated/server';
import { getImageUrl } from './organisation';

export const getServicePoints = query({
  args: {
    organisationId: v.id('organizations'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('servicePoints')
      .withIndex('by_organisation_id', (q) =>
        q.eq('organizationId', args.organisationId)
      )
      .collect();
  },
});

export const getOrganizationsByNameOfServicePoints = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const servicePoints = await ctx.db
      .query('servicePoints')
      .withSearchIndex('name', (q) => q.search('name', args.query))
      .collect();

    const organizationPromises = servicePoints.map(async (servicePoint) => {
      const organization = await ctx.db.get(servicePoint.organizationId);
      return {
        name: organization?.name!,
        image: organization?.avatar!,
        id: organization?._id!,
        description: organization?.description,
      };
    });

    return await Promise.all(organizationPromises);
  },
});
export const getSingleServicePointAndWorker = query({
  args: {
    servicePointId: v.optional(v.id('servicePoints')),
  },
  handler: async (ctx, args) => {
    if (!args.servicePointId) return null;
    const servicePoint = await ctx.db.get(args.servicePointId);
    if (!servicePoint) return null;

    return servicePoint;
  },
});
// mutation
export const createServicePoint = mutation({
  args: {
    description: v.optional(v.string()),
    organisationId: v.id('organizations'),
    name: v.string(),
    link: v.optional(v.string()),
    linkText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const alreadyHasServicePointWithName = await ctx.db
      .query('servicePoints')
      .withIndex('by_name_org_id', (q) =>
        q.eq('name', args.name).eq('organizationId', args.organisationId)
      )
      .first();
    if (alreadyHasServicePointWithName) {
      throw new ConvexError('You already have a service point with this name');
    }
    await ctx.db.insert('servicePoints', {
      organizationId: args.organisationId,
      name: args.name,
      form: false,
      description: args.description,
      externalLink: args.link,
      linkText: args.linkText,
    });
  },
});

export const updateServicePoint = mutation({
  args: {
    servicePointId: v.id('servicePoints'),
    name: v.string(),
    description: v.optional(v.string()),
    link: v.optional(v.string()),
    linkText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.servicePointId, {
      name: args.name,
      description: args.description,
      externalLink: args.link,
      linkText: args.linkText,
    });
  },
});

export const deleteServicePoint = mutation({
  args: { id: v.id('servicePoints') },
  handler: async (ctx, args) => {
    const servicePoint = await ctx.db.get(args.id);
    if (!servicePoint) {
      throw new ConvexError('Service point not found');
    }
    await ctx.db.delete(servicePoint._id);
  },
});

// helpers

export const getUserProfileByWorkerId = async (
  ctx: QueryCtx,
  userId: Id<'workers'>
) => {
  const user = await ctx.db
    .query('users')
    .filter((q) => q.eq(q.field('workerId'), userId))
    .first();
  const worker = await ctx.db.get(userId);
  if (!worker) return null;
  if (!user) return null;
  if (user?.imageUrl && user?.imageUrl.startsWith('http'))
    return {
      ...user,
      role: worker.role,
    };
  const imageUrl = await getImageUrl(ctx, user.imageUrl as Id<'_storage'>);
  return {
    ...user,
    imageUrl,
    role: worker.role,
  };
};
