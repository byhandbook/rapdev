import { fetchBlogs } from '$utils/fetchBlogs';
import { fetchCompany } from '$utils/fetchCompany';
import { fetchDataDog } from '$utils/fetchDataDog';
import { fetchResources } from '$utils/fetchResources';
import { fetchServiceNow } from '$utils/fetchServiceNow';
import { initNavDesktop } from '$utils/initNavbarSystemDesktop';
import { initNavMobile } from '$utils/initNavbarSystemMobile';
import { reLayout } from '$utils/reLayout';

const CACHE_KEY = 'megaCardsCachedddsdddsdsdgvvuuvsd';
const CACHE_TTL = 1000 * 60 * 60 * 24 * 30;
console.log('scrip running');
function getCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);

    const isExpired = Date.now() - parsed.timestamp > CACHE_TTL;
    if (isExpired) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return parsed.html;
  } catch {
    return null;
  }
}

function setCache(html: string) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      html,
      timestamp: Date.now(),
    })
  );
}

async function loadMegaCardRight() {
  try {
    const target = document.querySelector('.mega-cards');
    const targetLastChild = target?.lastElementChild;

    if (!target) return;

    // 👉 1. Try cache first
    const cachedHTML = getCache();

    if (cachedHTML) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = cachedHTML;

      Array.from(wrapper.children).forEach((child) => {
        target.insertBefore(child, targetLastChild);
      });

      console.log('Loaded from cache');
    } else {
      // 👉 2. Fetch fresh data
      const [dataDogCard, serviceNowCard, blogsCard, resourcesCard, companyCard] =
        await Promise.all([
          fetchDataDog(),
          fetchServiceNow(),
          fetchBlogs(),
          fetchResources(),
          fetchCompany(),
        ]);

      if (dataDogCard && serviceNowCard && blogsCard && resourcesCard && companyCard) {
        const fragment = document.createDocumentFragment();

        fragment.appendChild(dataDogCard);
        fragment.appendChild(serviceNowCard);
        fragment.appendChild(blogsCard);
        fragment.appendChild(resourcesCard);
        fragment.appendChild(companyCard);

        // Save HTML snapshot
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(fragment.cloneNode(true));
        setCache(tempDiv.innerHTML);

        // Inject into DOM
        target.insertBefore(fragment, targetLastChild);

        console.log('Fetched and cached');
      }
    }

    // 👉 Nav init (unchanged)
    if (window.innerWidth <= 992) {
      reLayout();
      await initNavMobile();
      console.log('Mobile Nav ready');
      return;
    }

    await initNavDesktop();
    console.log('Desktop Nav ready');
  } catch (error) {
    console.error('Error fetching mega card:', error);
  }
}

// Run after DOM loads
window.addEventListener('DOMContentLoaded', () => {
  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    'list',
    async (listInstances) => {
      await loadMegaCardRight();
    },
  ]);
});

// Reload page on resize
let isMobile = window.innerWidth <= 992;

window.addEventListener('resize', () => {
  const nowMobile = window.innerWidth <= 992;

  if (nowMobile !== isMobile) {
    window.location.reload();
  }
});
