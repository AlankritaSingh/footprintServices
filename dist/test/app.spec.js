"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("assert/strict"));
const sinon_1 = __importDefault(require("sinon"));
const supertest_1 = __importDefault(require("supertest"));
const http_1 = require("http");
const logger_1 = __importDefault(require("../src/lib/logger/logger"));
const app_1 = __importDefault(require("../src/lib/app"));
const externalServices = __importStar(require("../src/lib/externalServices"));
describe("Footprint app", () => {
    let loggerStub;
    let app;
    let getFootprintDataStub;
    let getTransportDataStub;
    beforeEach(() => {
        loggerStub = sinon_1.default.stub(logger_1.default);
        app = (0, app_1.default)(loggerStub);
        getFootprintDataStub = sinon_1.default.stub(externalServices, "getFootprintData");
        getTransportDataStub = sinon_1.default.stub(externalServices, "getTransportData");
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
                result: "10 kgCO2e",
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
            const response = await (0, supertest_1.default)(app)
                .post("/calculate")
                .send(payload)
                .expect(500);
            strict_1.default.equal(response.text, http_1.STATUS_CODES[500]);
        });
    });
});
//# sourceMappingURL=app.spec.js.map