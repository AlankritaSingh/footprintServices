"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequestBody = validateRequestBody;
const zod_1 = require("zod");
const http_status_codes_1 = require("http-status-codes");
function validateRequestBody(schema, logger) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            logger.error(`Error occurred: ${error}`);
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.issues.map((e) => ({
                    path: e.path[0],
                    message: e.message,
                }));
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: "Invalid request body", details: errorMessages });
            }
            else {
                res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal Server Error" });
            }
        }
    };
}
//# sourceMappingURL=validationMiddleware.js.map