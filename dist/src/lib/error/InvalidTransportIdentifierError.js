"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidTransportIdentifierError extends Error {
    constructor(identifier, targetCountry) {
        const message = `Invalid input: no transport data found for the transport identifier '${identifier}' or the targetCountry '${targetCountry}'`;
        super(message);
        this.name = this.constructor.name;
    }
}
exports.default = InvalidTransportIdentifierError;
//# sourceMappingURL=InvalidTransportIdentifierError.js.map