import assert from "assert/strict";
import sinon from "sinon";
import type { SinonStubbedInstance } from "sinon";
import request from "supertest";
import { STATUS_CODES } from "http";
import logger from "../src/lib/logger/logger";
import createApp from "../src/lib/app";
import type { Application } from "express";
import * as externalServices from "../src/lib/service/externalServices";

describe("Footprint app", () => {
  let loggerStub: SinonStubbedInstance<typeof logger>;
  let app: Application;
  let getFootprintDataStub: sinon.SinonStub;
  let getTransportDataStub: sinon.SinonStub;

  beforeEach(() => {
    loggerStub = sinon.stub(logger);
    app = createApp(loggerStub);

    getFootprintDataStub = sinon.stub(externalServices, "getFootprintData");
    getTransportDataStub = sinon.stub(externalServices, "getTransportData");
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
        result: "10 kgCO2e",
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
        `Bad Request- Invalid Identifier: no transport data found for the identifier 'invalid_transport'`
      );
    });

    it("should return 500 for unexpected errors", async () => {
      const payload = {
        footprint: "footprint1",
        transport: "transport1",
        targetCountry: "DE",
      };

      getFootprintDataStub.rejects(new Error("Unexpected error"));

      const response = await request(app)
        .post("/calculate")
        .send(payload)
        .expect(500);
      assert.equal(response.text, STATUS_CODES[500]);
    });
  });
});
