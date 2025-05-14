export default class InvalidTransportIdentifierError extends Error {
  constructor(identifier: string) {
    const message = `Invalid Identifier: no transport data found for the identifier '${identifier}'`;
    super(message);
    this.name = this.constructor.name;
  }
}
