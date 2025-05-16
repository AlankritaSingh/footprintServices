import axios from "axios";
import { Logger } from "winston";
import { IExternalService } from "./model/IExternalService";
import { transportDataResponse } from "./model/responseTypes";

/**
 * TransportService class to fetch transport data from an external API.
 * Implements the IExternalService interface.
 */
export default class TransportService
  implements IExternalService<transportDataResponse[]>
{
  private readonly TRANSPORT_URL =
    "https://frankvisuals.github.io/co2-data/transport.json";

  constructor(private log: Logger) {}

  public async fetchData(): Promise<transportDataResponse[]> {
    try {
      const response = await axios.get<transportDataResponse[]>(
        this.TRANSPORT_URL
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          this.log.error(
            "Transport service: Request failed with status:",
            error.response.status
          );
        } else if (error.request) {
          this.log.error(
            "Transport service: No Response Received:",
            error.request
          );
        } else {
          this.log.error(
            "Transport service: Request failed with error:",
            error.message
          );
        }
      } else {
        this.log.error("Error fetching Transport data:", error);
      }
      throw error;
    }
  }
}
