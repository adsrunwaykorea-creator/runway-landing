import { getDaangnPixelId, isDaangnPixelConfigured } from "@/lib/tracking/daangn-pixel";

export function DaangnPixelScripts() {
  const pixelId = getDaangnPixelId();

  if (!isDaangnPixelConfigured()) {
    return null;
  }

  const initScript = `
(function (w, d, s, pixelId) {
  var js = d.createElement(s);
  js.src = "https://karrot-pixel.business.daangn.com/karrot-pixel.js";
  js.async = true;
  js.onload = function () {
    if (!w.karrotPixel) {
      console.warn("[Daangn Pixel] karrot-pixel.js loaded but window.karrotPixel is missing");
      return;
    }
    w.karrotPixel.init(pixelId);
    w.karrotPixel.track("ViewPage");
    console.log("[Daangn Pixel] Base tracking initialized (ViewPage)");
  };
  js.onerror = function () {
    console.error("[Daangn Pixel] Failed to load karrot-pixel.js");
  };
  d.head.appendChild(js);
})(window, document, "script", ${JSON.stringify(pixelId)});
`;

  return (
    <script
      id="daangn-pixel-bootstrap"
      dangerouslySetInnerHTML={{ __html: initScript }}
    />
  );
}
