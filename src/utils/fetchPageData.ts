export const fetchPageData = async (url: string) => {
  const response = await fetch(url);
  const htmlText = await response.text();

  // Parse the fetched HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  return doc;
};
