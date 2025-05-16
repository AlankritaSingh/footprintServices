"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("assert/strict"));
const sinon_1 = __importDefault(require("sinon"));
const FootprintCalculator_1 = require("../src/lib/service/FootprintCalculator");
const logger_1 = __importDefault(require("../src/lib/logger/logger"));
describe("FootprintCalculator", () => {
    let calculator;
    let loggerStub;
    beforeEach(() => {
        loggerStub = sinon_1.default.stub(logger_1.default);
        calculator = new FootprintCalculator_1.FootprintCalculator(loggerStub);
    });
    afterEach(() => {
        sinon_1.default.restore();
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
        sinon_1.default.stub(calculator, "getDataFromExternalServices").resolves({
            footprintData,
            transportData,
        });
        const result = await calculator.calculateFootprint(footprint, transport, targetCountry);
        strict_1.default.strictEqual(result.result, "10.00 kgCO2e");
    });
});
//# sourceMappingURL=FootprintCalculator.spec.js.map