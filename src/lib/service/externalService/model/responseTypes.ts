import { z } from "zod";

const footPrintData = z.object({
  identifier: z.string(),
  country: z.string(),
  description: z.string(),
  footprint_value: z.number(),
  footprint_unit: z.string(),
});

const transportData = z.object({
  identifier: z.string(),
  factor: z.number(),
  origin_country: z.string(),
  target_country: z.string(),
});

export type footPrintDataResponse = z.infer<typeof footPrintData>;
export type transportDataResponse = z.infer<typeof transportData>;
