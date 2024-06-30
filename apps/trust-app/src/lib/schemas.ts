import { z } from "zod";

export const createSchema = (platforms: { name: string; label: string }[]) => {
  const schemaObject: any = {};
  platforms.forEach((platform) => {
    schemaObject[platform.name] = z
      .string()
      .url()
      .min(1, `The ${platform.label} field must not be empty`);
  });

  return z.object(schemaObject).refine(
    (data) => {
      return platforms.every((platform) => data[platform.name]);
    },
    {
      message: "All active platform fields must be filled with valid URLs",
    },
  );
};

export const addressVerificationSchema = z.object({
  address: z.string().min(1, "Address is required"),
});

export const CoordinatesSchema = z.object({
  lat: z.number(),
  lon: z.number(),
});
