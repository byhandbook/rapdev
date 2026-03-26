window.Webflow ||= [];
window.Webflow.push(() => {
  // Join RapDev Slider
  const joinRapdevSwiper = new Swiper('#join-rapdev-slider', {
    spaceBetween: 16,
    slidesPerView: 1.2,
    loop: false,
    navigation: {
      nextEl: '#swiper-button-next',
      prevEl: '#swiper-button-prev',
    },
    breakpoints: {
      609: {
        slidesPerView: 2.2,
        spaceBetween: 16,
      },
      995: {
        slidesPerView: 3.2,
        spaceBetween: 16,
      },
    },
  });

  // Quote Slider
  const quoteSwiper = new Swiper('#quote-slider', {
    slidesPerView: 1,
    pagination: {
      el: '#quote-slider-pagination',
      clickable: true,
    },
  });
});
