"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidFootprintIdentifierError extends Error {
    constructor(identifier) {
        const message = `Invalid Identifier: no footprint value found for the identifier '${identifier}'`;
        super(message);
        this.name = this.constructor.name;
    }
}
exports.default = InvalidFootprintIdentifierError;
//# sourceMappingURL=InvalidFootprintIdentifierError.js.map