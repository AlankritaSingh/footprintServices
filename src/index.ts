import createFootprintApp from "./lib/footprintApp";
import logger from "./lib/logger/logger";

const { PORT = 3000 } = process.env;

const app = createFootprintApp(logger);

app
  .on("error", (err) => logger.error(err.stack))
  .listen(PORT, () => {
    logger.info(`App is listening on port ${PORT}`);
  });
