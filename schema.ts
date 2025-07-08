import { z } from 'zod';

export const editOrganizationSchema = z.object({
  organizationName: z.string().min(1, 'Name of organization is required'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  startDay: z.string().min(1, 'Working days are required'),
  endDay: z.string().min(1, 'Working days are required'),
  startTime: z.string().min(1, 'Working time is required'),
  endTime: z.string().min(1, 'Working time is required'),
  websiteUrl: z.string().min(1, 'Website link is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  image: z.string().min(1, 'Logo is required'),
});

export type EditOrganizationSchemaType = z.infer<typeof editOrganizationSchema>;
