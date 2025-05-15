import { z } from "zod";

export const footPrintPayloadSchema = z.object({
  footprint: z.string({
    required_error: "footprint is required",
  }),
  transport: z.string({
    required_error: "transport is required",
  }),
  targetCountry: z
    .string({
      required_error: "targetCountry is required",
    })
    .min(2, "targetCountry must be equal to 2 characters")
    .max(2, "targetCountry must be equal to 2 characters"),
});

export type FootPrintPayload = z.infer<typeof footPrintPayloadSchema>;
