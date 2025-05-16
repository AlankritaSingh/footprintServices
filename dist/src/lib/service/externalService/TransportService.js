"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
/**
 * TransportService class to fetch transport data from an external API.
 * Implements the IExternalService interface.
 */
class TransportService {
    constructor(log) {
        this.log = log;
        this.TRANSPORT_URL = "https://frankvisuals.github.io/co2-data/transport.json";
    }
    async fetchData() {
        try {
            const response = await axios_1.default.get(this.TRANSPORT_URL);
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                if (error.response) {
                    this.log.error("Transport service: Request failed with status:", error.response.status);
                }
                else if (error.request) {
                    this.log.error("Transport service: No Response Received:", error.request);
                }
                else {
                    this.log.error("Transport service: Request failed with error:", error.message);
                }
            }
            else {
                this.log.error("Error fetching Transport data:", error);
            }
            throw error;
        }
    }
}
exports.default = TransportService;
//# sourceMappingURL=TransportService.js.map