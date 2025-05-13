import axios from "axios";
import { footPrintData, transportData } from "./types";
import { Logger } from "winston";

export async function getFootprintData(
  logger: Logger
): Promise<footPrintData[]> {
  try {
    const response = await axios.get<footPrintData[]>(
      "https://frankvisuals.github.io/co2-data/footprints.json"
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        logger.error(
          "Footprint service: Request failed with status:",
          error.response.status
        );
      } else if (error.request) {
        logger.error("Footprint service: No Response Received:", error.request);
      } else {
        logger.error(
          "Footprint service: Request failed with error:",
          error.message
        );
      }
    } else {
      logger.error("Error fetching Footprint data:", error);
    }
    throw error;
  }
}

export async function getTransportData(
  logger: Logger
): Promise<transportData[]> {
  try {
    const response = await axios.get<transportData[]>(
      "https://frankvisuals.github.io/co2-data/transport.json"
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        logger.error(
          "Transport service: Request failed with status:",
          error.response.status
        );
      } else if (error.request) {
        logger.error("Transport service: No Response Received:", error.request);
      } else {
        logger.error(
          "Transport service: Request failed with error:",
          error.message
        );
      }
    } else {
      logger.error("Error fetching transport data:", error);
    }
    throw error;
  }
}
