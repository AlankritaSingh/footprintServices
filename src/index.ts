import createApp from "./lib/app";

const { PORT = 3000 } = process.env;

const app = createApp();

app
  .on("error", (err) => console.error(err.stack))
  .listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
  });
