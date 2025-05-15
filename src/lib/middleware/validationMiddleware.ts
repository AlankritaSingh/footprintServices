import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { Logger } from "winston";

export function validateRequestBody(
  schema: z.ZodObject<any, any>,
  logger: Logger
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      logger.error(`Error occurred: ${error}`);

      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((e) => ({
          path: e.path[0],
          message: e.message,
        }));

        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid request body", details: errorMessages });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    }
  };
}
