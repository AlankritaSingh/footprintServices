"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("assert/strict"));
const sinon_1 = __importDefault(require("sinon"));
const supertest_1 = __importDefault(require("supertest"));
const http_1 = require("http");
const logger_1 = __importDefault(require("../src/lib/logger/logger"));
const footprintApp_1 = __importDefault(require("../src/lib/footprintApp"));
const FootprintService_1 = __importDefault(require("../src/lib/service/externalService/FootprintService"));
const TransportService_1 = __importDefault(require("../src/lib/service/externalService/TransportService"));
describe("Footprint app", () => {
    let loggerStub;
    let app;
    let getFootprintDataStub;
    let getTransportDataStub;
    beforeEach(() => {
        loggerStub = sinon_1.default.stub(logger_1.default);
        app = (0, footprintApp_1.default)(loggerStub);
        getFootprintDataStub = sinon_1.default.stub(FootprintService_1.default.prototype, "fetchData");
        getTransportDataStub = sinon_1.default.stub(TransportService_1.default.prototype, "fetchData");
    });
    afterEach(() => {
        sinon_1.default.restore();
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
            const { body } = await (0, supertest_1.default)(app)
                .post("/calculate")
                .send(payload)
                .expect(201);
            strict_1.default.deepEqual(body, expectedResponse);
        });
        it("should return 400 with error message for invalid payload", async () => {
            const payload = {
                footprint: "footprint1",
                transport: "transport1",
            };
            const response = await (0, supertest_1.default)(app)
                .post("/calculate")
                .send(payload)
                .expect(400);
            strict_1.default.equal(response.status, 400);
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
            const response = await (0, supertest_1.default)(app)
                .post("/calculate")
                .send(payload)
                .expect(400);
            strict_1.default.equal(response.text, `Bad Request- Invalid Identifier: no footprint value found for the identifier 'invalid_footprint'`);
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
            const response = await (0, supertest_1.default)(app)
                .post("/calculate")
                .send(payload)
                .expect(400);
            strict_1.default.equal(response.text, `Bad Request- Invalid Identifier: no transport data found for the identifier 'invalid_transport'`);
        });
        it("should return 500 for unexpected errors", async () => {
            const payload = {
                footprint: "footprint1",
                transport: "transport1",
                targetCountry: "DE",
            };
            getFootprintDataStub.rejects(new Error("Unexpected error"));
            getTransportDataStub.resolves([]);
            const response = await (0, supertest_1.default)(app)
                .post("/calculate")
                .send(payload)
                .expect(500);
            strict_1.default.equal(response.text, `${http_1.STATUS_CODES[500]}- Unexpected error`);
        });
    });
});
//# sourceMappingURL=footprintApp.spec.js.map