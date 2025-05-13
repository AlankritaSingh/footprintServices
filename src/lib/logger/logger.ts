import winston, { format } from "winston";
export type { Logger } from "winston";

const { createLogger, transports } = winston;
const { combine, splat, timestamp, json } = format;
const { Console } = transports;

const logger = createLogger({
  level: "debug",
  format: combine(splat(), timestamp(), json()),
  transports: [new Console()],
});

export default logger;
