import express, { Request, Response, NextFunction } from "express";
import type { ErrorRequestHandler } from "express";
import { STATUS_CODES } from "http";
import { FootprintCalculator } from "./FootprintCalculator";
import { Logger } from "winston";
import InvalidFootprintIdentifierError from "./error/InvalidFootprintIdentifierError";
import InvalidTransportIdentifierError from "./error/InvalidTransportIdentifierError";
import { validateRequestBody } from "./middleware/validationMiddleware";
import {
  footPrintPayloadSchema,
  type FootPrintPayload,
} from "./middleware/schemas/validationSchema";

export default (logger: Logger) => {
  const app = express();

  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Node.js!");
  });

  app.post(
    "/calculate",
    // express.json(),
    validateRequestBody(footPrintPayloadSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const footPrintPayload: FootPrintPayload = req.body;
        const { footprint, transport, targetCountry } = footPrintPayload;
        const calculator = new FootprintCalculator(logger);

        const calculatedFootprint = await calculator.calculateFootprint(
          footprint,
          transport,
          targetCountry
        );

        res.status(201).json({ ...calculatedFootprint });
      } catch (error) {
        next(error);
      }
    }
  );

  const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    logger.error(`Error occurred: ${error.message} - ${error.stack}`);

    if (error instanceof InvalidFootprintIdentifierError) {
      res
        .status(400)
        .set("Content-Type", "text/plain")
        .send(`${STATUS_CODES[400]}- ${error.message}`);
    } else if (error instanceof InvalidTransportIdentifierError) {
      res
        .status(400)
        .set("Content-Type", "text/plain")
        .send(`${STATUS_CODES[400]}- ${error.message}`);
    } else {
      const { code = 500 } = error;
      res.status(code).send(STATUS_CODES[code]);
    }
  };

  app.use(errorHandler);

  return app;
};
