import express from "express";
import type { ErrorRequestHandler } from "express";
import { STATUS_CODES } from "http";
import { footprintResult, footPrintPayload } from "./types";
import { FootprintCalculator } from "./FootprintCalculator";
import { Logger } from "winston";
import InvalidFootprintIdentifierError from "./error/InvalidFootprintIdentifierError";
import InvalidTransportIdentifierError from "./error/InvalidTransportIdentifierError";

export default (logger: Logger) => {
  const app = express();

  app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Node.js!");
  });

  app.post<unknown, footprintResult, footPrintPayload>(
    "/calculate",
    express.json(),
    async (req, res, next) => {
      try {
        const footPrintPayload = req.body;
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
      res.status(500).set("Content-Type", "text/plain").send(error.message);
    } else if (error instanceof InvalidTransportIdentifierError) {
      res.status(500).set("Content-Type", "text/plain").send(error.message);
    } else {
      const { code = 500 } = error;
      res.status(code).send(STATUS_CODES[code]);
    }
  };

  app.use(errorHandler);

  return app;
};
