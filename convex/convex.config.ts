// convex/convex.config.ts
import { defineApp } from 'convex/server';
import resend from '@convex-dev/resend/convex.config';
import polar from '@convex-dev/polar/convex.config';
import betterAuth from './betterAuth/convex.config';

import pushNotifications from '@convex-dev/expo-push-notifications/convex.config';

const app = defineApp();
app.use(pushNotifications);
app.use(resend);
app.use(polar);
app.use(betterAuth);

export default app;
