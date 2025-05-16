import express, { Request, Response, NextFunction } from "express";
import type { ErrorRequestHandler } from "express";
import { STATUS_CODES } from "http";
import { FootprintCalculator } from "./service/FootprintCalculator";
import { Logger } from "winston";
import InvalidFootprintIdentifierError from "./error/InvalidFootprintIdentifierError";
import InvalidTransportIdentifierError from "./error/InvalidTransportIdentifierError";
import { validateRequestBody } from "./middleware/validationMiddleware";
import {
  footPrintPayloadSchema,
  type FootPrintPayload,
} from "./middleware/schemas/validationSchema";
import { StatusCodes } from "http-status-codes";
import { footprintResult } from "./types";

export default (logger: Logger) => {
  const app = express();

  app.use(express.json());

  app.post(
    "/calculate",
    validateRequestBody(footPrintPayloadSchema, logger), // Middleware to validate the request body
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const footPrintPayload: FootPrintPayload = req.body;
        const { footprint, transport, targetCountry } = footPrintPayload;

        const calculator = new FootprintCalculator(logger);

        const calculatedFootprint: footprintResult =
          await calculator.calculateFootprint(
            footprint,
            transport,
            targetCountry
          );

        res.status(StatusCodes.CREATED).json(calculatedFootprint);
      } catch (error) {
        next(error);
      }
    }
  );

  const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    logger.error(`Error occurred: ${error.message} - ${error.stack}`);

    if (error instanceof InvalidFootprintIdentifierError) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .set("Content-Type", "text/plain")
        .send(`${STATUS_CODES[StatusCodes.BAD_REQUEST]}- ${error.message}`);
    } else if (error instanceof InvalidTransportIdentifierError) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .set("Content-Type", "text/plain")
        .send(`${STATUS_CODES[StatusCodes.BAD_REQUEST]}- ${error.message}`);
    } else {
      const { code = StatusCodes.INTERNAL_SERVER_ERROR } = error;
      res.status(code).send(`${STATUS_CODES[code]}- ${error.message}`);
    }
  };

  app.use(errorHandler);

  return app;
};
