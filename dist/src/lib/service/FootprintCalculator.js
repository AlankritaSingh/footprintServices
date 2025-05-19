"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FootprintCalculator = void 0;
const InvalidFootprintIdentifierError_1 = __importDefault(require("../error/InvalidFootprintIdentifierError"));
const InvalidTransportIdentifierError_1 = __importDefault(require("../error/InvalidTransportIdentifierError"));
const logger_1 = __importDefault(require("../logger/logger"));
const FootprintService_1 = __importDefault(require("./externalService/FootprintService"));
const TransportService_1 = __importDefault(require("./externalService/TransportService"));
/**
 * FootprintCalculator class to calculate the carbon footprint based on the provided footprint and transport identifiers.
 */
class FootprintCalculator {
    constructor(log) {
        this.log = log;
    }
    async calculateFootprint(footprint, transport, targetCountry) {
        const { footprintData, transportData } = await this.getDataFromExternalServices(logger_1.default);
        this.log.info(`Finished fetching data from external services`);
        const footprintInfo = footprintData.find((data) => data.identifier === footprint);
        if (!footprintInfo) {
            throw new InvalidFootprintIdentifierError_1.default(footprint);
        }
        const transportInfo = transportData.find((data) => data.identifier === transport &&
            data.target_country === targetCountry &&
            data.origin_country === footprintInfo.country);
        if (!transportInfo) {
            throw new InvalidTransportIdentifierError_1.default(transport, targetCountry);
        }
        const calculatedFootprint = footprintInfo.footprint_value * transportInfo.factor;
        this.log.info(`Finished calculating footprint data`);
        return {
            result: calculatedFootprint.toFixed(2).toString() +
                " " +
                footprintInfo.footprint_unit,
        };
    }
    async getDataFromExternalServices(logger) {
        let footprintData = [];
        let transportData = [];
        const footprintService = new FootprintService_1.default(logger);
        const transportService = new TransportService_1.default(logger);
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
exports.FootprintCalculator = FootprintCalculator;
//# sourceMappingURL=FootprintCalculator.js.map