window.Webflow ||= [];
window.Webflow.push(() => {
  /* =========================
     NAV DROPDOWN TOGGLE
  ========================== */
  const dropdownBlock = document.querySelector('[data="dd-block"]');
  const dropdownHeader = document.querySelector('[data="dd-header"]');
  const dropdownTable = document.querySelector('[data="dd-table"]');

  dropdownBlock?.addEventListener('click', () => {
    const isActive = dropdownHeader?.classList.contains('active');

    dropdownHeader?.classList.toggle('active', !isActive);
    dropdownTable?.classList.toggle('active', !isActive);
  });

  /* =========================
     TOC ACTIVE STATE (SCROLL SPY)
  ========================== */
  const sections = document.querySelectorAll('.content-block-anchor');
  const tocItems = document.querySelectorAll('.toc-item');

  if (!sections.length || !tocItems.length) return;

  const clearActive = () => {
    tocItems.forEach((item) => item.classList.remove('is-active'));
  };

  // Default active state
  tocItems[0].classList.add('is-active');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        clearActive();

        const id = entry.target.id;

        tocItems.forEach((item) => {
          const link = item.querySelector('a.toc-link');

          if (link?.getAttribute('href') === '#' + id) {
            item.classList.add('is-active');
          }
        });
      });
    },
    {
      rootMargin: '-100px 0px -65% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
});
