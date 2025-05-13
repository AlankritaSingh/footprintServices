"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const FootprintCalculator_1 = require("./FootprintCalculator");
const InvalidFootprintIdentifierError_1 = __importDefault(require("./error/InvalidFootprintIdentifierError"));
const InvalidTransportIdentifierError_1 = __importDefault(require("./error/InvalidTransportIdentifierError"));
exports.default = (logger) => {
    const app = (0, express_1.default)();
    app.get("/", (req, res) => {
        res.send("Hello, TypeScript with Node.js!");
    });
    app.post("/calculate", express_1.default.json(), async (req, res, next) => {
        try {
            const footPrintPayload = req.body;
            const { footprint, transport, targetCountry } = footPrintPayload;
            const calculator = new FootprintCalculator_1.FootprintCalculator(logger);
            const calculatedFootprint = await calculator.calculateFootprint(footprint, transport, targetCountry);
            res.status(201).json({ ...calculatedFootprint });
        }
        catch (error) {
            next(error);
        }
    });
    const errorHandler = (error, req, res, next) => {
        logger.error(`Error occurred: ${error.message} - ${error.stack}`);
        if (error instanceof InvalidFootprintIdentifierError_1.default) {
            res.status(500).set("Content-Type", "text/plain").send(error.message);
        }
        else if (error instanceof InvalidTransportIdentifierError_1.default) {
            res.status(500).set("Content-Type", "text/plain").send(error.message);
        }
        else {
            const { code = 500 } = error;
            res.status(code).send(http_1.STATUS_CODES[code]);
        }
    };
    app.use(errorHandler);
    return app;
};
//# sourceMappingURL=app.js.map