import { fetchBlogs } from '$utils/fetchBlogs';
import { fetchCompany } from '$utils/fetchCompany';
import { fetchDataDog } from '$utils/fetchDataDog';
import { fetchResources } from '$utils/fetchResources';
import { fetchServiceNow } from '$utils/fetchServiceNow';
import { initNavDesktop } from '$utils/initNavbarSystemDesktop';
import { initNavMobile } from '$utils/initNavbarSystemMobile';
import { reLayout } from '$utils/reLayout';

async function loadMegaCardRight() {
  try {
    // fetch data dog
    const dataDogCard = await fetchDataDog();

    // fetch service now
    const serviceNowCard = await fetchServiceNow();

    // fetch blogs
    const blogsCard = await fetchBlogs();

    // fetch resources
    const resourcesCard = await fetchResources();

    // fetch company
    const companyCard = await fetchCompany();

    // Inject into current page (change selector if needed)
    const target = document.querySelector('.mega-cards');
    const targetLastChild = target?.lastElementChild;

    if (target && dataDogCard && serviceNowCard && blogsCard && resourcesCard && companyCard) {
      target.insertBefore(dataDogCard, targetLastChild);
      target.insertBefore(serviceNowCard, targetLastChild);
      target.insertBefore(blogsCard, targetLastChild);
      target.insertBefore(resourcesCard, targetLastChild);
      target.insertBefore(companyCard, targetLastChild);
    }

    if (window.innerWidth <= 992) {
      reLayout();
      await initNavMobile();
      console.log('Mobile Nav ready');
      return;
    }
    //  await navbarSystem();
    await initNavDesktop();
    console.log(' Desktop Nav ready');
  } catch (error) {
    console.error('Error fetching mega card:', error);
  }
}

// Run after DOM loads
document.addEventListener('DOMContentLoaded', loadMegaCardRight);

// Reload page on resize

let isMobile = window.innerWidth <= 992;

window.addEventListener('resize', () => {
  const nowMobile = window.innerWidth <= 992;

  if (nowMobile !== isMobile) {
    window.location.reload();
  }
});
