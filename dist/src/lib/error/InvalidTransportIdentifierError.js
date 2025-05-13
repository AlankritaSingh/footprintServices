"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidTransportIdentifierError extends Error {
    constructor(code) {
        const message = `Invalid Identifier: no transport data found for the identifier ${code}`;
        super(message);
        this.name = this.constructor.name;
    }
}
exports.default = InvalidTransportIdentifierError;
//# sourceMappingURL=InvalidTransportIdentifierError.js.map