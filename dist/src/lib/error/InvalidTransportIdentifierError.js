"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidTransportIdentifierError extends Error {
    constructor(identifier) {
        const message = `Invalid Identifier: no transport data found for the identifier '${identifier}'`;
        super(message);
        this.name = this.constructor.name;
    }
}
exports.default = InvalidTransportIdentifierError;
//# sourceMappingURL=InvalidTransportIdentifierError.js.map