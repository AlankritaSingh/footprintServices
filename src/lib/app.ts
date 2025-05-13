import express from "express";
import { footprintResult, footPrintPayload } from "./types";
import { FootprintCalculator } from "./FootprintCalculator";

export default () => {
  const app = express();

  app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Node.js!");
  });

  app.post<unknown, footprintResult, footPrintPayload>(
    "/calculate",
    express.json(),
    async (req, res) => {
      const footPrintPayload = req.body;
      const { footprint, transport, targetCountry } = footPrintPayload;
      const calculator = new FootprintCalculator(
        footprint,
        transport,
        targetCountry
      );
      const calculatedFootprint = await calculator.calculateFootprint();

      res.status(201).json({ ...calculatedFootprint });
    }
  );

  return app;
};
