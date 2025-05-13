export default class InvalidTransportIdentifierError extends Error {
  constructor(code: string) {
    const message = `Invalid Identifier: no transport data found for the identifier ${code}`;
    super(message);
    this.name = this.constructor.name;
  }
}
