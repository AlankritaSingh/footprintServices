"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const FootprintCalculator_1 = require("./FootprintCalculator");
exports.default = () => {
    const app = (0, express_1.default)();
    app.get("/", (req, res) => {
        res.send("Hello, TypeScript with Node.js!");
    });
    app.post("/calculate", express_1.default.json(), async (req, res) => {
        const footPrintPayload = req.body;
        const { footprint, transport, targetCountry } = footPrintPayload;
        const calculator = new FootprintCalculator_1.FootprintCalculator(footprint, transport, targetCountry);
        const calculatedFootprint = await calculator.calculateFootprint();
        res.status(201).json({ ...calculatedFootprint });
    });
    return app;
};
//# sourceMappingURL=app.js.map