import { footprintResult } from "../types";
import { Logger } from "winston";
import InvalidFootprintIdentifierError from "../error/InvalidFootprintIdentifierError";
import InvalidTransportIdentifierError from "../error/InvalidTransportIdentifierError";
import logger from "../logger/logger";
import {
  footPrintDataResponse,
  transportDataResponse,
} from "./externalService/model/responseTypes";
import FootprintService from "./externalService/FootprintService";
import TransportService from "./externalService/TransportService";

/**
 * FootprintCalculator class to calculate the carbon footprint based on the provided footprint and transport identifiers.
 */
export class FootprintCalculator {
  constructor(private log: Logger) {}

  public async calculateFootprint(
    footprint: string,
    transport: string,
    targetCountry: string
  ): Promise<footprintResult> {
    const { footprintData, transportData } =
      await this.getDataFromExternalServices(logger);

    this.log.info(`Finished fetching data from external services`);

    const footprintInfo = footprintData.find(
      (data) => data.identifier === footprint
    );

    if (!footprintInfo) {
      throw new InvalidFootprintIdentifierError(footprint);
    }

    const transportInfo = transportData.find(
      (data) =>
        data.identifier === transport &&
        data.target_country === targetCountry &&
        data.origin_country === footprintInfo.country
    );

    if (!transportInfo) {
      throw new InvalidTransportIdentifierError(transport, targetCountry);
    }

    const calculatedFootprint =
      footprintInfo.footprint_value * transportInfo.factor;

    this.log.info(`Finished calculating footprint data`);

    return {
      result:
        calculatedFootprint.toFixed(2).toString() +
        " " +
        footprintInfo.footprint_unit,
    };
  }

  async getDataFromExternalServices(logger: Logger): Promise<{
    footprintData: footPrintDataResponse[];
    transportData: transportDataResponse[];
  }> {
    let footprintData: footPrintDataResponse[] = [];
    let transportData: transportDataResponse[] = [];

    const footprintService = new FootprintService(logger);
    const transportService = new TransportService(logger);

    // Fetch data from external services in parallel for better performance
    await Promise.all([
      footprintService.fetchData().then((result) => {
        footprintData = result;
      }),
      transportService.fetchData().then((result) => {
        transportData = result;
      }),
    ]);
    return { footprintData, transportData };
  }
}
