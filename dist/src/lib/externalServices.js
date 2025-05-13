"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFootprintData = getFootprintData;
exports.getTransportData = getTransportData;
const axios_1 = __importDefault(require("axios"));
async function getFootprintData(logger) {
    try {
        const response = await axios_1.default.get("https://frankvisuals.github.io/co2-data/footprints.json");
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if (error.response) {
                logger.error("Footprint service: Request failed with status:", error.response.status);
            }
            else if (error.request) {
                logger.error("Footprint service: No Response Received:", error.request);
            }
            else {
                logger.error("Footprint service: Request failed with error:", error.message);
            }
        }
        else {
            logger.error("Error fetching Footprint data:", error);
        }
        throw error;
    }
}
async function getTransportData(logger) {
    try {
        const response = await axios_1.default.get("https://frankvisuals.github.io/co2-data/transport.json");
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if (error.response) {
                logger.error("Transport service: Request failed with status:", error.response.status);
            }
            else if (error.request) {
                logger.error("Transport service: No Response Received:", error.request);
            }
            else {
                logger.error("Transport service: Request failed with error:", error.message);
            }
        }
        else {
            logger.error("Error fetching transport data:", error);
        }
        throw error;
    }
}
//# sourceMappingURL=externalServices.js.map