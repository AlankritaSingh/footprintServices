"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./lib/app"));
const logger_1 = __importDefault(require("./lib/logger/logger"));
const { PORT = 3000 } = process.env;
const app = (0, app_1.default)(logger_1.default);
app
    .on("error", (err) => logger_1.default.error(err.stack))
    .listen(PORT, () => {
    logger_1.default.info(`App is listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map