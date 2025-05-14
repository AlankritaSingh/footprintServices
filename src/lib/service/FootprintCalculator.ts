import { footprintResult, footPrintData, transportData } from "../types";
import { getFootprintData, getTransportData } from "./externalServices";
import { Logger } from "winston";
import InvalidFootprintIdentifierError from "../error/InvalidFootprintIdentifierError";
import InvalidTransportIdentifierError from "../error/InvalidTransportIdentifierError";
import logger from "../logger/logger";

export class FootprintCalculator {
  constructor(private log: Logger) {}

  public async calculateFootprint(
    footprint: string,
    transport: string,
    targetCountry: string
  ): Promise<footprintResult> {
    const { footprintData, transportData } =
      await this.getFootprintAndTransportData(logger);

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
      throw new InvalidTransportIdentifierError(transport);
    }

    const calculatedFootprint =
      footprintInfo.footprint_value * transportInfo.factor;

    this.log.info(`Finished calculating footprint data`);

    return {
      result:
        calculatedFootprint.toString() + " " + footprintInfo.footprint_unit,
    };
  }

  async getFootprintAndTransportData(logger: Logger): Promise<{
    footprintData: footPrintData[];
    transportData: transportData[];
  }> {
    let footprintData: footPrintData[] = [];
    let transportData: transportData[] = [];

    await Promise.all([
      getFootprintData(logger).then((result) => {
        footprintData = result;
      }),
      getTransportData(logger).then((result) => {
        transportData = result;
      }),
    ]);
    return { footprintData, transportData };
  }
}
