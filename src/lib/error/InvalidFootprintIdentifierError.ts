export default class InvalidFootprintIdentifierError extends Error {
  constructor(identifier: string) {
    const message = `Invalid Identifier: no footprint value found for the identifier ${identifier}`;
    super(message);
    this.name = this.constructor.name;
  }
}
