import axios from "axios";
import { footPrintData, transportData } from "./types";

export async function getFootprintData(): Promise<footPrintData[]> {
  try {
    const response: footPrintData[] = await axios.get(
      "https://frankvisuals.github.io/co2-data/footprints.json"
    );
    return response;
  } catch (error) {
    console.error("Error fetching footprint data:", error);
    throw error;
  }
}

export async function getTransportData(): Promise<transportData[]> {
  try {
    const response: transportData[] = await axios.get(
      "https://frankvisuals.github.io/co2-data/transport.json"
    );
    return response;
  } catch (error) {
    console.error("Error fetching transport data:", error);
    throw error;
  }
}
