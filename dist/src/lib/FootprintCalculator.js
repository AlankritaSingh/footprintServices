"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FootprintCalculator = void 0;
const externalServices_1 = require("./externalServices");
const InvalidFootprintIdentifierError_1 = __importDefault(require("./error/InvalidFootprintIdentifierError"));
const InvalidTransportIdentifierError_1 = __importDefault(require("./error/InvalidTransportIdentifierError"));
const logger_1 = __importDefault(require("./logger/logger"));
class FootprintCalculator {
    constructor(log) {
        this.log = log;
    }
    async calculateFootprint(footprint, transport, targetCountry) {
        const { footprintData, transportData } = await this.getFootprintAndTransportData(logger_1.default);
        this.log.info(`Finished fetching data from external services`);
        const footprintInfo = footprintData.find((data) => data.identifier === footprint);
        if (!footprintInfo) {
            throw new InvalidFootprintIdentifierError_1.default(footprint);
        }
        const transportInfo = transportData.find((data) => data.identifier === transport &&
            data.target_country === targetCountry &&
            data.origin_country === footprintInfo.country);
        if (!transportInfo) {
            throw new InvalidTransportIdentifierError_1.default(transport);
        }
        const calculatedFootprint = footprintInfo.footprint_value * transportInfo.factor;
        this.log.info(`Finished calculating footprint data`);
        return {
            result: calculatedFootprint.toString() + " " + footprintInfo.footprint_unit,
        };
    }
    async getFootprintAndTransportData(logger) {
        let footprintData = [];
        let transportData = [];
        await Promise.all([
            (0, externalServices_1.getFootprintData)(logger).then((result) => {
                footprintData = result;
            }),
            (0, externalServices_1.getTransportData)(logger).then((result) => {
                transportData = result;
            }),
        ]);
        return { footprintData, transportData };
    }
}
exports.FootprintCalculator = FootprintCalculator;
//# sourceMappingURL=FootprintCalculator.js.map