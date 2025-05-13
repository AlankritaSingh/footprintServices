"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FootprintCalculator = void 0;
const externalServices_1 = require("./externalServices");
class FootprintCalculator {
    constructor(footprint, transport, targetCountry) {
        this.footprint = footprint;
        this.transport = transport;
        this.targetCountry = targetCountry;
    }
    async calculateFootprint() {
        const { footprintData, transportData } = await this.getFootprintAndTransportData();
        const footprint = footprintData.find((data) => data.identifier === this.footprint);
        const transport = transportData.find((data) => data.identifier === this.transport &&
            data.target_country === this.targetCountry &&
            data.origin_country === footprint?.country);
        return {
            result: (footprint.footprint_value * transport.factor).toString() +
                " " +
                footprint.footprint_unit,
        };
    }
    async getFootprintAndTransportData() {
        let footprintData = [];
        let transportData = [];
        await Promise.all([
            (0, externalServices_1.getFootprintData)().then((result) => {
                footprintData = result;
            }),
            (0, externalServices_1.getTransportData)().then((result) => {
                transportData = result;
            }),
        ]);
        return { footprintData, transportData };
    }
}
exports.FootprintCalculator = FootprintCalculator;
//# sourceMappingURL=FootprintCalculator.js.map