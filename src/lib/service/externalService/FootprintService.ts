import axios from "axios";
import { Logger } from "winston";
import { IExternalService } from "./model/IExternalService";
import { footPrintDataResponse } from "./model/responseTypes";

/**
 * FootprintService class to fetch footprint data from an external API.
 * Implements the IExternalService interface.
 */
export default class FootprintService
  implements IExternalService<footPrintDataResponse[]>
{
  private readonly FOOTPRINT_URL =
    "https://frankvisuals.github.io/co2-data/footprints.json";

  constructor(private log: Logger) {}

  public async fetchData(): Promise<footPrintDataResponse[]> {
    try {
      const response = await axios.get<footPrintDataResponse[]>(
        this.FOOTPRINT_URL
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          this.log.error(
            "Footprint service: Request failed with status:",
            error.response.status
          );
        } else if (error.request) {
          this.log.error(
            "Footprint service: No Response Received:",
            error.request
          );
        } else {
          this.log.error(
            "Footprint service: Request failed with error:",
            error.message
          );
        }
      } else {
        this.log.error("Error fetching Footprint data:", error);
      }
      throw error;
    }
  }
}
