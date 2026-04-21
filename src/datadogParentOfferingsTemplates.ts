window.Webflow ||= [];
window.Webflow.push(() => {
  /* =========================
     NAV DROPDOWN TOGGLE
  ========================== */
  const dropdownBlock = document.querySelector('[data="dd-block"]');
  const dropdownHeader = document.querySelector('[data="dd-header"]');
  const dropdownTable = document.querySelector('[data="dd-table"]');

  // Toggle dropdown on click
  dropdownBlock?.addEventListener('click', () => {
    if (dropdownHeader?.classList.contains('active')) {
      dropdownHeader.classList.remove('active');
      dropdownTable?.classList.remove('active');
    } else {
      dropdownHeader?.classList.add('active');
      dropdownTable?.classList.add('active');
    }
  });

  /* =========================
     TOC ACTIVE STATE (SCROLL SPY)
  ========================== */
  const sections = document.querySelectorAll('.content-block-anchor');
  const tocItems = document.querySelectorAll('.toc-item');

  // Remove active state from all TOC items
  function clearActive() {
    tocItems.forEach((item) => item.classList.remove('is-active'));
  }

  // Set first item active by default
  if (tocItems.length) {
    tocItems[0].classList.add('is-active');
  }

  // Observe sections entering viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          clearActive();

          const id = entry.target.id;

          // Match section ID with TOC link href
          tocItems.forEach((item) => {
            const link = item.querySelector('a.toc-link');
            if (link && link.getAttribute('href') === '#' + id) {
              item.classList.add('is-active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-100px 0px -65% 0px', // controls trigger point
      threshold: 0,
    }
  );

  // Start observing each section
  sections.forEach((section) => observer.observe(section));
});
