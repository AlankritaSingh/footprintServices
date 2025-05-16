import { z } from "zod";

const footprintResult = z.object({
  result: z.string(),
});

export type footprintResult = z.infer<typeof footprintResult>;
