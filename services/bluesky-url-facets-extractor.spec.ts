import { describe, it, expect } from "vitest";
import buildUrlFacets from "./bluesky-url-facets-extractor";

describe("Bluesky build url facets from text", () => {
  it("should return empty array if no url in text", () => {
    const text = "This is a text without url";
    const urls = buildUrlFacets(text);
    expect(urls).toEqual([]);
  });

  it("should find urls in text", () => {
    const text =
      "\u2728 example mentioning @atproto.com to share the URL \ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68 https://en.wikipedia.org/wiki/CBOR.";
    const urls = buildUrlFacets(text);
    expect(urls).toEqual([
      {
        index: {
          byteStart: 74,
          byteEnd: 108,
        },
        features: [
          {
            $type: "app.bsky.richtext.facet#link",
            uri: "https://en.wikipedia.org/wiki/CBOR",
          },
        ],
      },
    ]);
  });
});
