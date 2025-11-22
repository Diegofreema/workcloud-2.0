import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();
crons.interval(
  'Remove old emails from the resend component',
  { hours: 24 * 7 },
  internal.cleanUpResend.cleanupResend
);

// crons.interval(
//   'Sync Polar products',
//   { seconds: 15 },
//   internal.polar.syncProducts
// );
export default crons;
