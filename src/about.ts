window.Webflow ||= [];
window.Webflow.push(() => {
  let splide1;
  let splide2;

  const mq = window.matchMedia('(max-width: 767px)');

  function initSplides(isMobile) {
    // destroy existing sliders before recreating
    if (splide1) splide1.destroy(true);
    if (splide2) splide2.destroy(true);

    const perPageValue = isMobile ? 1 : 3;

    // FIRST SLIDER
    splide1 = new Splide('#splide-carousel-1', {
      direction: isMobile ? 'ltr' : 'ttb',
      height: 'auto',
      perPage: perPageValue,
      gap: '1rem',
      type: 'loop',
      arrows: false,
      pagination: false,
      drag: false,

      autoScroll: {
        speed: 0.4,
        pauseOnHover: true,
        pauseOnFocus: false,
      },
    });

    // SECOND SLIDER
    splide2 = new Splide('#splide-carousel-2', {
      direction: isMobile ? 'ltr' : 'ttb',
      height: 'auto',
      perPage: perPageValue,
      gap: '1rem',
      type: 'loop',
      arrows: false,
      pagination: false,
      drag: false,

      autoScroll: {
        speed: -0.4,
        pauseOnHover: true,
        pauseOnFocus: false,
      },
    });

    splide1.mount(window.splide.Extensions);
    splide2.mount(window.splide.Extensions);
  }

  // initial load
  initSplides(mq.matches);

  // only run when breakpoint changes
  mq.addEventListener('change', function (e) {
    initSplides(e.matches);
  });
});
