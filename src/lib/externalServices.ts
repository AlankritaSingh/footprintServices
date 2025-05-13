import axios from "axios";
import { footPrintData, transportData } from "./types";

export async function getFootprintData(): Promise<footPrintData[]> {
  try {
    const response = await axios.get<footPrintData[]>(
      "https://frankvisuals.github.io/co2-data/footprints.json"
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(
          "Footprint service: Request failed with status:",
          error.response.status
        );
      } else if (error.request) {
        console.error(
          "Footprint service: No Response Received:",
          error.request
        );
      } else {
        console.error(
          "Footprint service: Request failed with error:",
          error.message
        );
      }
    } else {
      console.error("Error fetching Footprint data:", error);
    }
    throw error;
  }
}

export async function getTransportData(): Promise<transportData[]> {
  try {
    const response = await axios.get<transportData[]>(
      "https://frankvisuals.github.io/co2-data/transport.json"
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(
          "Transport service: Request failed with status:",
          error.response.status
        );
      } else if (error.request) {
        console.error(
          "Transport service: No Response Received:",
          error.request
        );
      } else {
        console.error(
          "Transport service: Request failed with error:",
          error.message
        );
      }
    } else {
      console.error("Error fetching transport data:", error);
    }
    throw error;
  }
}
