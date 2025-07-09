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
export const createOrganizationSchema = z.object({
  organizationName: z.string().min(1, 'Name of organization is required'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  startDay: z.string().optional(),
  endDay: z.string().optional(),
  startTime: z.string().min(1, 'Working time is required'),
  endTime: z.string().min(1, 'Working time is required'),
  websiteUrl: z.string().min(1, 'Website link is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  image: z.string().min(1, 'Logo is required'),
});

export const createWorkerSchema = z.object({
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  gender: z.string().min(1, 'Gender is required'),
  location: z.string().min(1, 'Location is required'),
  experience: z
    .string()
    .min(1, 'Experience is required')
    .max(150, 'Maximum 100 characters'),
  skills: z
    .string()
    .min(1, 'Skills are required')
    .min(1, 'Minimum of 1 skill is required'),
  qualifications: z.string().min(1, 'Qualifications are required'),
});
export const editWorkerSchema = z.object({
  gender: z.string().min(1, 'Gender is required'),
  location: z.string().min(1, 'Location is required'),
  experience: z
    .string()
    .min(1, 'Experience is required')
    .max(150, 'Maximum 100 characters'),
  skills: z
    .string()
    .min(1, 'Skills are required')
    .min(1, 'Minimum of 1 skill is required'),
  qualifications: z.string().min(1, 'Qualifications are required'),
});

export type CreateWorkerSchemaType = z.infer<typeof createWorkerSchema>;
export type EditWorkerSchemaType = z.infer<typeof editWorkerSchema>;

export type CreateOrganizationSchemaType = z.infer<
  typeof createOrganizationSchema
>;

export type EditOrganizationSchemaType = z.infer<typeof editOrganizationSchema>;
