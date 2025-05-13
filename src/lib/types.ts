export type footPrintPayload = {
  footprint: string;
  transport: string;
  targetCountry: string;
};

export type footprint_unit = "kgCO2e";

export type footprint_value = number;

export type footprintResult = {
  result: string;
};

export interface footPrintData {
  identifier: string;
  country: string;
  description: string;
  footprint_value: number;
  footprint_unit: string;
}

export interface transportData {
  identifier: string;
  factor: number;
  origin_country: string;
  target_country: string;
}
