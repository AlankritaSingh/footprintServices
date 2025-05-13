import { footprintResult, footPrintData, transportData } from "./types";
import { getFootprintData, getTransportData } from "./externalServices";

export class FootprintCalculator {
  private footprint: string;
  private transport: string;
  private targetCountry: string;

  constructor(footprint: string, transport: string, targetCountry: string) {
    this.footprint = footprint;
    this.transport = transport;
    this.targetCountry = targetCountry;
  }

  public async calculateFootprint(): Promise<footprintResult> {
    const { footprintData, transportData } =
      await this.getFootprintAndTransportData();

    const footprint = footprintData.find(
      (data) => data.identifier === this.footprint
    );
    const transport = transportData.find(
      (data) =>
        data.identifier === this.transport &&
        data.target_country === this.targetCountry &&
        data.origin_country === footprint?.country
    );
    return {
      result:
        (footprint!.footprint_value * transport!.factor).toString() +
        " " +
        footprint!.footprint_unit,
    };
  }

  async getFootprintAndTransportData(): Promise<{
    footprintData: footPrintData[];
    transportData: transportData[];
  }> {
    let footprintData: footPrintData[] = [];
    let transportData: transportData[] = [];

    await Promise.all([
      getFootprintData().then((result) => {
        footprintData = result;
      }),
      getTransportData().then((result) => {
        transportData = result;
      }),
    ]);
    return { footprintData, transportData };
  }
}
