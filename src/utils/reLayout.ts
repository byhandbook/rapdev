export const reLayout = () => {
  const megaLinkParents = document.querySelectorAll(`[navbar-info-link]`);

  megaLinkParents.forEach((eachLinkParent) => {
    const slug = eachLinkParent.getAttribute(`navbar-info-link`);
    const correspondingInfoCard = document.querySelector(`[navbar-info-card=${slug}]`);

    const mobileInfoCardParent = eachLinkParent.querySelector(`.mega-drawer`);

    const appended = mobileInfoCardParent?.append(correspondingInfoCard);
  });

  // mobile footer wrap
  const navFooterMobile = document.querySelector(`.nav-footer-mobile`);

  const navbarFooter = document.querySelector('.navbar-footer');

  navFooterMobile?.append(navbarFooter);
};
