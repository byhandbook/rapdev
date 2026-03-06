import { fetchPageData } from '$utils/fetchPageData';

window.Webflow ||= [];
window.Webflow.push(async () => {
  const BASE_URL = '/bedrock-project-2026/videos-counter?f1840d01_page=';

  const playlistCounts = new Map<string, number>();

  const processDoc = (doc: Document) => {
    const items = doc.querySelectorAll('[data="playlist-name"]');

    items.forEach((el) => {
      const name = el.textContent?.trim();
      if (!name) return;

      playlistCounts.set(name, (playlistCounts.get(name) ?? 0) + 1);
    });

    return items.length;
  };

  let page = 1;

  while (true) {
    const doc = await fetchPageData(`${BASE_URL}${page}`);

    const itemCount = processDoc(doc);

    if (itemCount === 0) break;

    page++;
  }

  const playlistCards = document.querySelectorAll('[data="playlist-card"]');

  playlistCards.forEach((card) => {
    const playlistName = card.querySelector('[data="playlist-name"]')?.textContent?.trim();

    if (!playlistName) return;

    const count = playlistCounts.get(playlistName) ?? 0;

    const numberEl = card.querySelector('[data="playlist-number"]') as HTMLElement | null;

    if (!numberEl) return;

    numberEl.textContent = `${count} Videos`;
  });
});
