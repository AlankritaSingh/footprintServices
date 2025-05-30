import assert from "assert/strict";
import sinon from "sinon";
import type { SinonStubbedInstance } from "sinon";
import request from "supertest";
import { STATUS_CODES } from "http";
import logger from "../src/lib/logger/logger";
import createApp from "../src/lib/footprintApp";
import type { Application } from "express";
import FootprintService from "../src/lib/service/externalService/FootprintService";
import TransportService from "../src/lib/service/externalService/TransportService";

describe("Footprint app", () => {
  let loggerStub: SinonStubbedInstance<typeof logger>;
  let app: Application;
  let getFootprintDataStub: sinon.SinonStub;
  let getTransportDataStub: sinon.SinonStub;

  beforeEach(() => {
    loggerStub = sinon.stub(logger);
    app = createApp(loggerStub);

    getFootprintDataStub = sinon.stub(FootprintService.prototype, "fetchData");
    getTransportDataStub = sinon.stub(TransportService.prototype, "fetchData");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("calculate endpoint", () => {
    it("should return 201 with calculated footprint", async () => {
      const payload = {
        footprint: "footprint1",
        transport: "transport1",
        targetCountry: "DE",
      };

      getFootprintDataStub.resolves([
        {
          identifier: "footprint1",
          country: "IT",
          description: "description1",
          footprint_value: 5,
          footprint_unit: "kgCO2e",
        },
      ]);

      getTransportDataStub.resolves([
        {
          identifier: "transport1",
          factor: 2,
          origin_country: "IT",
          target_country: "DE",
        },
        {
          identifier: "transport1",
          factor: 3,
          origin_country: "FR",
          target_country: "DE",
        },
      ]);

      const expectedResponse = {
        result: "10.00 kgCO2e",
      };

      const { body } = await request(app)
        .post("/calculate")
        .send(payload)
        .expect(201);

      assert.deepEqual(body, expectedResponse);
    });

    it("should return 400 with error message for invalid payload", async () => {
      const payload = {
        footprint: "footprint1",
        transport: "transport1",
      };
      const response = await request(app)
        .post("/calculate")
        .send(payload)
        .expect(400);
      assert.equal(response.status, 400);
      assert.equal(
        response.text,
        `{"error":"Invalid request body","details":[{"path":"targetCountry","message":"targetCountry is required"}]}`
      );
    });

    it("should return 400 with error message for invalid footprint identifier", async () => {
      const payload = {
        footprint: "invalid_footprint",
        transport: "transport1",
        targetCountry: "IT",
      };

      getFootprintDataStub.resolves([]);
      getTransportDataStub.resolves([
        {
          identifier: "transport1",
          factor: 2,
          origin_country: "IT",
          target_country: "DE",
        },
        {
          identifier: "transport1",
          factor: 3,
          origin_country: "FR",
          target_country: "DE",
        },
      ]);

      const response = await request(app)
        .post("/calculate")
        .send(payload)
        .expect(400);
      assert.equal(
        response.text,
        `Bad Request- Invalid Identifier: no footprint value found for the identifier 'invalid_footprint'`
      );
    });

    it("should return 400 with error message for invalid transport identifier", async () => {
      const payload = {
        footprint: "footprint1",
        transport: "invalid_transport",
        targetCountry: "DE",
      };

      getFootprintDataStub.resolves([
        {
          identifier: "footprint1",
          country: "IT",
          description: "description1",
          footprint_value: 5,
          footprint_unit: "kgCO2e",
        },
      ]);

      getTransportDataStub.resolves([]);

      const response = await request(app)
        .post("/calculate")
        .send(payload)
        .expect(400);
      assert.equal(
        response.text,
        `Bad Request- Invalid input: no transport data found for the transport identifier 'invalid_transport' or the targetCountry 'DE'`
      );
    });

    it("should return 400 with error message for not matching targetCountry", async () => {
      const payload = {
        footprint: "footprint1",
        transport: "transport1",
        targetCountry: "GB",
      };

      getFootprintDataStub.resolves([
        {
          identifier: "footprint1",
          country: "IT",
          description: "description1",
          footprint_value: 5,
          footprint_unit: "kgCO2e",
        },
      ]);

      getTransportDataStub.resolves([
        {
          identifier: "transport1",
          factor: 2,
          origin_country: "IT",
          target_country: "DE",
        },
        {
          identifier: "transport1",
          factor: 3,
          origin_country: "FR",
          target_country: "DE",
        },
      ]);

      const response = await request(app)
        .post("/calculate")
        .send(payload)
        .expect(400);
      assert.equal(
        response.text,
        `Bad Request- Invalid input: no transport data found for the transport identifier 'transport1' or the targetCountry 'GB'`
      );
    }
    );

    it("should return 500 for unexpected errors", async () => {
      const payload = {
        footprint: "footprint1",
        transport: "transport1",
        targetCountry: "DE",
      };

      getFootprintDataStub.rejects(new Error("Unexpected error"));
      getTransportDataStub.resolves([]);

      const response = await request(app)
        .post("/calculate")
        .send(payload)
        .expect(500);

      assert.equal(response.text, `${STATUS_CODES[500]}- Unexpected error`);
    });
  });
});
