export default class InvalidTransportIdentifierError extends Error {
  constructor(identifier: string, targetCountry: string) {
    const message = `Invalid input: no transport data found for the transport identifier '${identifier}' or the targetCountry '${targetCountry}'`;
    super(message);
    this.name = this.constructor.name;
  }
}
