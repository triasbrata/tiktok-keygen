import * as Sentry from "@sentry/nextjs";

export async function register() {
  Sentry.init({
    dsn: "https://34f5da70eb23230897206b55f98ba63f@o4507871057608704.ingest.de.sentry.io/4508112020897872",

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
}

export const onRequestError = Sentry.captureRequestError;
