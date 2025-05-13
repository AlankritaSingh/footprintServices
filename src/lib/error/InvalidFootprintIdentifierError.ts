export default class InvalidFootprintIdentifierError extends Error {
  constructor(code: string) {
    const message = `Invalid Identifier: no footprint value found for the identifier ${code}`;
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
