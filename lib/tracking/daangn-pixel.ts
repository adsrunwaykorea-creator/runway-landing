export const DAANGN_SUBMIT_APPLICATION_EVENT = "SubmitApplication" as const;

type KarrotPixel = {
  init: (pixelId: string) => void;
  track: (eventName: string) => void;
};

declare global {
  interface Window {
    karrotPixel?: KarrotPixel;
  }
}

const LOG_PREFIX = "[Daangn Pixel]";
const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 200;

let submitApplicationInFlight = false;

export function getDaangnPixelId() {
  return process.env.NEXT_PUBLIC_DAANGN_PIXEL_ID?.trim() ?? "";
}

export function isDaangnPixelConfigured() {
  return getDaangnPixelId().length > 0;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getKarrotPixelStatus() {
  const karrotPixel = window.karrotPixel;

  return {
    exists: Boolean(karrotPixel),
    hasInit: typeof karrotPixel?.init === "function",
    hasTrack: typeof karrotPixel?.track === "function",
  };
}

function fireSubmitApplicationOnce(): boolean {
  const karrotPixel = window.karrotPixel;

  if (!karrotPixel || typeof karrotPixel.track !== "function") {
    return false;
  }

  karrotPixel.track(DAANGN_SUBMIT_APPLICATION_EVENT);
  return true;
}

export async function trackDaangnSubmitApplication(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  if (submitApplicationInFlight) {
    console.log(`${LOG_PREFIX} SubmitApplication skipped (duplicate call blocked)`);
    return false;
  }

  submitApplicationInFlight = true;

  console.log(
    `${LOG_PREFIX} Preparing SubmitApplication after consultation_leads insert success`,
  );
  console.log(`${LOG_PREFIX} window.karrotPixel status (before):`, getKarrotPixelStatus());

  try {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      const status = getKarrotPixelStatus();

      if (!status.hasTrack) {
        console.warn(
          `${LOG_PREFIX} karrotPixel.track unavailable (attempt ${attempt}/${MAX_ATTEMPTS})`,
        );

        if (attempt < MAX_ATTEMPTS) {
          await sleep(RETRY_DELAY_MS);
          continue;
        }

        console.error(
          `${LOG_PREFIX} SubmitApplication failed: window.karrotPixel.track is not available`,
        );
        return false;
      }

      console.log(
        `${LOG_PREFIX} Calling window.karrotPixel.track("${DAANGN_SUBMIT_APPLICATION_EVENT}") (attempt ${attempt}/${MAX_ATTEMPTS})`,
      );

      const fired = fireSubmitApplicationOnce();

      if (!fired) {
        console.error(`${LOG_PREFIX} SubmitApplication call returned false`);
        return false;
      }

      console.log(
        `${LOG_PREFIX} SubmitApplication fired after consultation_leads insert success`,
      );
      console.log(`${LOG_PREFIX} window.karrotPixel status (after):`, getKarrotPixelStatus());
      return true;
    }

    return false;
  } catch (error) {
    console.error(`${LOG_PREFIX} SubmitApplication failed with error`, error);
    return false;
  } finally {
    submitApplicationInFlight = false;
  }
}
