const buildUrlFacets = (text: string) => {
  const urlRegex =
    /http(s)?:\/\/.[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+~#?&//=]*)/g;
  const urlFacets = [];

  const encoder = new TextEncoder();

  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const startIndex = encoder.encode(text.substring(0, match.index)).length;
    const url = match[0];
    const endIndex = startIndex + encoder.encode(url).length;

    urlFacets.push({
      index: {
        byteStart: startIndex,
        byteEnd: endIndex,
      },
      features: [
        {
          $type: "app.bsky.richtext.facet#link",
          uri: url,
        },
      ],
    });
  }

  return urlFacets;
};

export default buildUrlFacets;
