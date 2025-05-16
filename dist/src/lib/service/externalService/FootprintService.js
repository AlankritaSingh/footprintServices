"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
/**
 * FootprintService class to fetch footprint data from an external API.
 * Implements the IExternalService interface.
 */
class FootprintService {
    constructor(log) {
        this.log = log;
        this.FOOTPRINT_URL = "https://frankvisuals.github.io/co2-data/footprints.json";
    }
    async fetchData() {
        try {
            const response = await axios_1.default.get(this.FOOTPRINT_URL);
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                if (error.response) {
                    this.log.error("Footprint service: Request failed with status:", error.response.status);
                }
                else if (error.request) {
                    this.log.error("Footprint service: No Response Received:", error.request);
                }
                else {
                    this.log.error("Footprint service: Request failed with error:", error.message);
                }
            }
            else {
                this.log.error("Error fetching Footprint data:", error);
            }
            throw error;
        }
    }
}
exports.default = FootprintService;
//# sourceMappingURL=FootprintService.js.map