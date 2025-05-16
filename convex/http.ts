import { httpRouter } from 'convex/server';

import { internal } from '~/convex/_generated/api';
import { httpAction } from '~/convex/_generated/server';

const http = httpRouter();

export const createOrUpdateUserToDb = httpAction(async (ctx, request) => {
  const { data, type } = await request.json();

  switch (type) {
    case 'user.created':
      await ctx.runMutation(internal.users.createUser, {
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        name: data.first_name + ' ' + data.last_name,
        imageUrl: data.image_url,
        isOnline: true,
      });
      break;
    case 'user.updated':
      console.log('user updated');
      break;
  }
  return new Response(null, { status: 200 });
});
http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: createOrUpdateUserToDb,
});
export default http;
