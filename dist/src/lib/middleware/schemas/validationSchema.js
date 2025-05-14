"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.footPrintPayloadSchema = void 0;
const zod_1 = require("zod");
exports.footPrintPayloadSchema = zod_1.z.object({
    footprint: zod_1.z.string({
        required_error: "footprint is required",
    }),
    transport: zod_1.z.string({
        required_error: "transport is required",
    }),
    targetCountry: zod_1.z
        .string()
        .min(2, "targetCountry must be equal to 2 characters")
        .max(2, "targetCountry must be equal to 2 characters"),
});
//# sourceMappingURL=validationSchema.js.map