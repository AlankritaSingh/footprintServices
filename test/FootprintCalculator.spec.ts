import assert from "assert/strict";
import sinon from "sinon";
import type { SinonStubbedInstance } from "sinon";
import { FootprintCalculator } from "../src/lib/FootprintCalculator";
import logger from "../src/lib/logger/logger";

describe("FootprintCalculator", () => {
  let calculator: FootprintCalculator;
  let loggerStub: SinonStubbedInstance<typeof logger>;

  beforeEach(() => {
    loggerStub = sinon.stub(logger);
    calculator = new FootprintCalculator(loggerStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should calculate footprint correctly", async () => {
    const footprint = "footprint1";
    const transport = "transport1";
    const targetCountry = "DE";

    const footprintData = [
      {
        identifier: "footprint1",
        country: "IT",
        description: "description1",
        footprint_value: 5,
        footprint_unit: "kgCO2e",
      },
    ];

    const transportData = [
      {
        identifier: "transport1",
        factor: 2,
        origin_country: "IT",
        target_country: "DE",
      },
    ];

    sinon.stub(calculator, "getFootprintAndTransportData").resolves({
      footprintData,
      transportData,
    });

    const result = await calculator.calculateFootprint(
      footprint,
      transport,
      targetCountry
    );

    assert.strictEqual(result.result, "10 kgCO2e");
  });
});
