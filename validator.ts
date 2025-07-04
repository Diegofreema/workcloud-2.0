import { z } from "zod";

export const schema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "A maximum of 100 characters is allowed")
      .regex(
        /^[a-zA-Z0-9 ]*$/,
        "Only alphanumeric characters and spaces are allowed",
      ),
    description: z
      .string()
      .max(255, "A maximum of 255 characters is allowed")
      .optional(),
    link: z.string().optional(),
    linkText: z.string().optional(),
  })
  .refine(
    (data) => {
      return !(data.link && !data.linkText);
    },
    {
      message: "Link text is required when a link is provided",
      path: ["linkText"],
    },
  )
  .refine(
    (data) => {
      return !(
        data.link &&
        (!data.link.startsWith("https") || !data.link.startsWith("www"))
      );
    },
    {
      message: "Link must start with https or www.",
      path: ["link"],
    },
  );

export type SchemaType = z.infer<typeof schema>;
