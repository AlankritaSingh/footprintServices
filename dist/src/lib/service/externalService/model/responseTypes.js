"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const footPrintData = zod_1.z.object({
    identifier: zod_1.z.string(),
    country: zod_1.z.string(),
    description: zod_1.z.string(),
    footprint_value: zod_1.z.number(),
    footprint_unit: zod_1.z.string(),
});
const transportData = zod_1.z.object({
    identifier: zod_1.z.string(),
    factor: zod_1.z.number(),
    origin_country: zod_1.z.string(),
    target_country: zod_1.z.string(),
});
//# sourceMappingURL=responseTypes.js.map