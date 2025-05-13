"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFootprintData = getFootprintData;
exports.getTransportData = getTransportData;
const axios_1 = __importDefault(require("axios"));
async function getFootprintData() {
    try {
        const response = await axios_1.default.get("https://frankvisuals.github.io/co2-data/footprints.json");
        return response.data;
    }
    catch (error) {
        console.error("Error fetching footprint data:", error);
        throw error;
    }
}
async function getTransportData() {
    try {
        const response = await axios_1.default.get("https://frankvisuals.github.io/co2-data/transport.json");
        return response.data;
    }
    catch (error) {
        console.error("Error fetching transport data:", error);
        throw error;
    }
}
//# sourceMappingURL=externalServices.js.map