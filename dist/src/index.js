"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./lib/app"));
const { PORT = 3000 } = process.env;
const app = (0, app_1.default)();
app
    .on("error", (err) => console.error(err.stack))
    .listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map