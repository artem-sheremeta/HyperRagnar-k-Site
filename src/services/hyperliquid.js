export async function fetchMidPricesFromHyperliquid(symbols) {
  try {
    const response = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "metaAndAssetCtxs" }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const json = await response.json();
    const meta = json[0];
    const assetCtxs = json[1];

    if (!meta || !Array.isArray(meta.universe) || !Array.isArray(assetCtxs)) {
      throw new Error("Incorrect response format from Hyperliquid");
    }

    const result = {};
    symbols.forEach((sym) => {
      const idx = meta.universe.findIndex((coinObj) => coinObj.name === sym);
      if (idx !== -1) {
        const midPx = assetCtxs[idx]?.midPx;
        const numeric = midPx != null ? Number(midPx) : NaN;
        result[sym] = isNaN(numeric) ? null : numeric;
      } else {
        result[sym] = null;
      }
    });

    return result;
  } catch (err) {
    console.error("Error fetchMidPricesFromHyperliquid:", err);
    const fallback = {};
    symbols.forEach((sym) => (fallback[sym] = null));
    return fallback;
  }
}
