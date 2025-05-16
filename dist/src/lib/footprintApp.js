"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const FootprintCalculator_1 = require("./service/FootprintCalculator");
const InvalidFootprintIdentifierError_1 = __importDefault(require("./error/InvalidFootprintIdentifierError"));
const InvalidTransportIdentifierError_1 = __importDefault(require("./error/InvalidTransportIdentifierError"));
const validationMiddleware_1 = require("./middleware/validationMiddleware");
const validationSchema_1 = require("./middleware/schemas/validationSchema");
const http_status_codes_1 = require("http-status-codes");
exports.default = (logger) => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.post("/calculate", (0, validationMiddleware_1.validateRequestBody)(validationSchema_1.footPrintPayloadSchema, logger), // Middleware to validate the request body
    async (req, res, next) => {
        try {
            const footPrintPayload = req.body;
            const { footprint, transport, targetCountry } = footPrintPayload;
            const calculator = new FootprintCalculator_1.FootprintCalculator(logger);
            const calculatedFootprint = await calculator.calculateFootprint(footprint, transport, targetCountry);
            res.status(http_status_codes_1.StatusCodes.CREATED).json(calculatedFootprint);
        }
        catch (error) {
            next(error);
        }
    });
    const errorHandler = (error, req, res, next) => {
        logger.error(`Error occurred: ${error.message} - ${error.stack}`);
        if (error instanceof InvalidFootprintIdentifierError_1.default) {
            res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .set("Content-Type", "text/plain")
                .send(`${http_1.STATUS_CODES[http_status_codes_1.StatusCodes.BAD_REQUEST]}- ${error.message}`);
        }
        else if (error instanceof InvalidTransportIdentifierError_1.default) {
            res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .set("Content-Type", "text/plain")
                .send(`${http_1.STATUS_CODES[http_status_codes_1.StatusCodes.BAD_REQUEST]}- ${error.message}`);
        }
        else {
            const { code = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR } = error;
            res.status(code).send(`${http_1.STATUS_CODES[code]}- ${error.message}`);
        }
    };
    app.use(errorHandler);
    return app;
};
//# sourceMappingURL=footprintApp.js.map