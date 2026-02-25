export const initNav = async () => {
  // ============================================
  // NAVBAR SYSTEM — Desktop + Mobile
  // ============================================
  //
  // PART 1 (Desktop): Hover dropdowns
  //   - nav-dropdown-link = "datadog" (on navbar links)
  //   - nav-dropdown-card = "datadog" (on dropdown panels)
  //
  // PART 2 (Desktop): Inner info tab crossfade
  //   - navbar-info-link = "gen-ai" (left-side link divs)
  //   - navbar-info-card = "gen-ai" (right-side content divs)
  //   - navbar-info-default = "active" (default content div)
  //   - Class "is-active" on default link div
  //
  // PART 3 (Mobile ≤ 991px): Slide navigation
  //   - Same nav-dropdown-link elements trigger mobile slide on click
  //   - navbar-mobile-links = "datadog" (mobile sub-link panels)
  //   - Parent wrapper class: "navbar-mobile-links" (set to display:none in Webflow)
  //   - navbar-mobile-back = "true" (back button inside parent wrapper)
  //
  // ============================================

  const MOBILE_BREAKPOINT = 991;
  const ANIMATION_DURATION = 400;
  const CLOSE_DELAY = 200;
  const INFO_FADE_DURATION = 200;
  const MOBILE_SLIDE_DURATION = 400;

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  // ——————————————————————————————————
  // PART 1: Desktop Dropdown Cards
  // ——————————————————————————————————

  const links = document.querySelectorAll('[nav-dropdown-link]');
  const cards = document.querySelectorAll('[nav-dropdown-card]');

  let activeCard = null;
  let closeTimeout = null;
  let clickLocked = false; // Track if card is locked open via click

  // Show/hide the wrapper that contains all dropdown cards
  const dropdownWrapper = document.querySelector('[nav-dropdown-card="wrapper"]');

  // Helper: update Is Active / Is Inactive classes on nav links
  function updateLinkClasses(activeKey) {
    links.forEach((l) => {
      const key = l.getAttribute('nav-dropdown-link');
      if (key === activeKey) {
        l.classList.add('is-active');
        l.classList.remove('is-inactive');
      } else {
        l.classList.remove('is-active');
        l.classList.add('is-inactive');
      }
    });
  }

  // Helper: remove all active/inactive classes (back to default)
  function clearLinkClasses() {
    links.forEach((l) => {
      l.classList.remove('is-active');
      l.classList.remove('is-inactive');
    });
  }

  cards.forEach((card) => {
    // Skip the wrapper itself
    if (card.getAttribute('nav-dropdown-card') === 'wrapper') return;

    card.style.display = 'none';
    card.style.opacity = '0';
    card.style.transform = 'translateY(-15px)';
    card.style.transition = `opacity ${ANIMATION_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1), transform ${ANIMATION_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
    card.style.pointerEvents = 'none';
  });

  function openCard(card) {
    if (activeCard === card) return;
    if (activeCard) closeCardInstant(activeCard);

    // Show the wrapper
    if (dropdownWrapper) dropdownWrapper.style.display = 'block';

    activeCard = card;
    card.style.display = 'flex';
    card.style.pointerEvents = 'auto';

    resetInfoTabs(card);
    void card.offsetHeight;

    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }

  function closeCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(-15px)';
    card.style.pointerEvents = 'none';

    if (activeCard === card) {
      activeCard = null;
      clickLocked = false;
      clearLinkClasses();
    }

    setTimeout(() => {
      if (card.style.opacity === '0') {
        card.style.display = 'none';
        if (!activeCard && dropdownWrapper) dropdownWrapper.style.display = 'none';
      }
    }, ANIMATION_DURATION);
  }

  function closeCardInstant(card) {
    card.style.display = 'none';
    card.style.opacity = '0';
    card.style.transform = 'translateY(-15px)';
    card.style.pointerEvents = 'none';
    if (activeCard === card) {
      activeCard = null;
      clickLocked = false;
    }
    if (!activeCard && dropdownWrapper) dropdownWrapper.style.display = 'none';
  }

  function cancelClose() {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
  }

  function scheduleClose(card) {
    // Don't auto-close if the card was locked open via click
    if (clickLocked) return;
    closeTimeout = setTimeout(() => closeCard(card), CLOSE_DELAY);
  }

  // Filter out the wrapper from interactive cards
  const interactiveCards = [...cards].filter(
    (c) => c.getAttribute('nav-dropdown-card') !== 'wrapper'
  );

  links.forEach((link) => {
    const key = link.getAttribute('nav-dropdown-link');
    const matchingCard = document.querySelector(`[nav-dropdown-card="${key}"]`);
    if (!matchingCard || key === 'wrapper') return;

    // Hover: open card (works alongside click)
    link.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      cancelClose();
      if (clickLocked) {
        clickLocked = false;
        clearLinkClasses();
      }
      openCard(matchingCard);
    });

    link.addEventListener('mouseleave', () => {
      if (isMobile()) return;
      scheduleClose(matchingCard);
    });

    // Click: toggle lock
    link.addEventListener('click', (e) => {
      if (isMobile()) return;
      e.preventDefault();
      e.stopPropagation();
      cancelClose();

      if (activeCard === matchingCard && clickLocked) {
        // Second click on same link — close and unlock
        clickLocked = false;
        closeCard(matchingCard);
      } else {
        // First click — open and lock
        openCard(matchingCard);
        clickLocked = true;
        updateLinkClasses(key);
      }
    });
  });

  interactiveCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      cancelClose();
    });
    card.addEventListener('mouseleave', () => {
      if (isMobile()) return;
      scheduleClose(card);
    });
  });

  // Also keep open when hovering the wrapper itself
  if (dropdownWrapper) {
    dropdownWrapper.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      cancelClose();
    });
    dropdownWrapper.addEventListener('mouseleave', () => {
      if (isMobile() || !activeCard) return;
      scheduleClose(activeCard);
    });
  }

  document.addEventListener('click', (e) => {
    if (isMobile() || !activeCard) return;
    const clickedInsideLink = [...links].some((l) => l.contains(e.target));
    const clickedInsideCard = interactiveCards.some((c) => c.contains(e.target));
    const clickedInsideWrapper = dropdownWrapper && dropdownWrapper.contains(e.target);
    if (!clickedInsideLink && !clickedInsideCard && !clickedInsideWrapper) {
      clickLocked = false;
      closeCard(activeCard);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeCard && !isMobile()) {
      clickLocked = false;
      closeCard(activeCard);
    }
  });

  // ——————————————————————————————————
  // PART 2: Desktop Inner Info Tabs (Crossfade)
  // ——————————————————————————————————

  const infoLinks = document.querySelectorAll('[navbar-info-link]');
  const infoCards = document.querySelectorAll('[navbar-info-card]');

  // Set up parent wrappers for stacking
  infoCards.forEach((card) => {
    const parent = card.parentElement;
    if (parent) parent.style.position = 'relative';

    card.style.transition = `opacity ${INFO_FADE_DURATION}ms ease`;

    if (card.getAttribute('navbar-info-default') === 'active') {
      // Default card: stays in normal flow (gives parent its height)
      card.style.position = 'relative';
      card.style.opacity = '1';
      card.style.pointerEvents = 'auto';
      card.style.zIndex = '1';
    } else {
      // Inactive cards: absolute so they don't affect layout
      card.style.position = 'absolute';
      card.style.top = '0';
      card.style.left = '0';
      card.style.width = '100%';
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';
      card.style.zIndex = '0';
    }
  });

  function showInfoCard(key, parentCard) {
    const scope = parentCard || document;

    // Hide all: make them absolute and invisible
    scope.querySelectorAll('[navbar-info-card]').forEach((c) => {
      c.style.position = 'absolute';
      c.style.top = '0';
      c.style.left = '0';
      c.style.width = '100%';
      c.style.opacity = '0';
      c.style.pointerEvents = 'none';
      c.style.zIndex = '0';
    });
    scope.querySelectorAll('[navbar-info-link]').forEach((l) => l.classList.remove('is-active'));

    // Show target: bring into normal flow
    const targetCard = scope.querySelector(`[navbar-info-card="${key}"]`);
    const targetLink = scope.querySelector(`[navbar-info-link="${key}"]`);

    if (targetCard) {
      targetCard.style.position = 'relative';
      targetCard.style.width = '';
      targetCard.style.opacity = '1';
      targetCard.style.pointerEvents = 'auto';
      targetCard.style.zIndex = '1';
    }
    if (targetLink) targetLink.classList.add('is-active');
  }

  function resetInfoTabs(parentCard) {
    // Hide all
    parentCard.querySelectorAll('[navbar-info-card]').forEach((c) => {
      c.style.position = 'absolute';
      c.style.top = '0';
      c.style.left = '0';
      c.style.width = '100%';
      c.style.opacity = '0';
      c.style.pointerEvents = 'none';
      c.style.zIndex = '0';
    });
    parentCard
      .querySelectorAll('[navbar-info-link]')
      .forEach((l) => l.classList.remove('is-active'));

    // Show default
    const defaultCard = parentCard.querySelector('[navbar-info-default="active"]');
    if (defaultCard) {
      const defaultKey = defaultCard.getAttribute('navbar-info-card');
      defaultCard.style.position = 'relative';
      defaultCard.style.width = '';
      defaultCard.style.opacity = '1';
      defaultCard.style.pointerEvents = 'auto';
      defaultCard.style.zIndex = '1';

      const defaultLink = parentCard.querySelector(`[navbar-info-link="${defaultKey}"]`);
      if (defaultLink) defaultLink.classList.add('is-active');
    }
  }

  infoLinks.forEach((link) => {
    const key = link.getAttribute('navbar-info-link');
    link.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      showInfoCard(key, link.closest('[nav-dropdown-card]'));
    });
  });

  // ——————————————————————————————————
  // PART 3: Mobile Slide Navigation
  // ——————————————————————————————————

  const mobileLinksParent = document.querySelector('.navbar-mobile-links');
  const mobileBackBtn = document.querySelector('[navbar-mobile-back="true"]');
  const mobilePanels = document.querySelectorAll('[navbar-mobile-links]');
  let mainMenuWrapper = null;
  let activeMobilePanel = null;

  // Initial setup for mobile parent wrapper
  if (mobileLinksParent) {
    mobileLinksParent.style.position = 'fixed';
    mobileLinksParent.style.top = '0';
    mobileLinksParent.style.left = '0';
    mobileLinksParent.style.width = '100%';
    mobileLinksParent.style.height = '100%';
    mobileLinksParent.style.zIndex = '1000';
    mobileLinksParent.style.transform = 'translateX(100%)';
    mobileLinksParent.style.transition = `transform ${MOBILE_SLIDE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    mobileLinksParent.style.display = 'none';
    mobileLinksParent.style.overflowY = 'auto';
  }

  // Hide all mobile sub-panels
  mobilePanels.forEach((panel) => (panel.style.display = 'none'));

  // Hide back button initially
  if (mobileBackBtn) mobileBackBtn.style.display = 'none';

  function getMainMenuWrapper() {
    if (!mainMenuWrapper) {
      mainMenuWrapper =
        document.querySelector('.w-nav-overlay') ||
        document.querySelector('[data-nav-menu-open]') ||
        document.querySelector('.w-nav-menu');
    }
    return mainMenuWrapper;
  }

  function openMobilePanel(key) {
    const targetPanel = document.querySelector(`[navbar-mobile-links="${key}"]`);
    if (!targetPanel || !mobileLinksParent) return;

    activeMobilePanel = targetPanel;

    // Show only the target panel
    mobilePanels.forEach((p) => (p.style.display = 'none'));
    targetPanel.style.display = 'block';

    // Show back button
    if (mobileBackBtn) mobileBackBtn.style.display = 'flex';

    // Show parent wrapper and prepare for slide
    mobileLinksParent.style.display = 'flex';
    mobileLinksParent.style.flexDirection = 'column';
    void mobileLinksParent.offsetHeight; // Force reflow

    // Slide main menu to the left with fade
    const menu = getMainMenuWrapper();
    if (menu) {
      menu.style.transition = `transform ${MOBILE_SLIDE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${MOBILE_SLIDE_DURATION}ms ease`;
      menu.style.transform = 'translateX(-30%)';
      menu.style.opacity = '0.3';
    }

    // Slide mobile panel in from right
    mobileLinksParent.style.transform = 'translateX(0)';
  }

  function closeMobilePanel() {
    if (!mobileLinksParent) return;

    // Slide mobile panel out to right
    mobileLinksParent.style.transform = 'translateX(100%)';

    // Slide main menu back in
    const menu = getMainMenuWrapper();
    if (menu) {
      menu.style.transform = 'translateX(0)';
      menu.style.opacity = '1';
    }

    // Clean up after animation
    setTimeout(() => {
      mobileLinksParent.style.display = 'none';
      mobilePanels.forEach((p) => (p.style.display = 'none'));
      if (mobileBackBtn) mobileBackBtn.style.display = 'none';
      activeMobilePanel = null;
    }, MOBILE_SLIDE_DURATION);
  }

  // Mobile: click on dropdown links to open sub-panel
  links.forEach((link) => {
    const key = link.getAttribute('nav-dropdown-link');

    link.addEventListener('click', (e) => {
      if (!isMobile()) return;
      e.preventDefault();
      e.stopPropagation();
      openMobilePanel(key);
    });
  });

  // Mobile: back button
  if (mobileBackBtn) {
    mobileBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMobilePanel();
    });
  }

  // Clean up on resize (mobile → desktop)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!isMobile()) {
        if (mobileLinksParent) {
          mobileLinksParent.style.display = 'none';
          mobileLinksParent.style.transform = 'translateX(100%)';
        }
        mobilePanels.forEach((p) => (p.style.display = 'none'));
        if (mobileBackBtn) mobileBackBtn.style.display = 'none';
        activeMobilePanel = null;

        const menu = getMainMenuWrapper();
        if (menu) {
          menu.style.transform = '';
          menu.style.opacity = '';
          menu.style.transition = '';
        }
      }
    }, 150);
  });

  const ACTIVE_CLASS = 'is-active';

  document.querySelectorAll('[nav-dropdown-card]').forEach((card) => {
    const navLinks = card.querySelectorAll('[navbar-info-link]');
    const renderItems = card.querySelectorAll('[nav-dropdown-render]');

    if (!navLinks.length || !renderItems.length) return;

    // Build slug → render element map
    const renderMap = new Map();
    renderItems.forEach((item) => {
      renderMap.set(item.getAttribute('nav-dropdown-render'), item);
    });

    // Hide all render items
    renderItems.forEach((item) => (item.style.display = 'none'));

    // Show first matching item
    let activeSlug = null;
    for (const link of navLinks) {
      const slug = link.getAttribute('navbar-info-link');
      if (renderMap.has(slug)) {
        renderMap.get(slug).style.display = '';
        link.classList.add(ACTIVE_CLASS);
        activeSlug = slug;
        break;
      }
    }

    // Hover interaction
    navLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        const slug = link.getAttribute('navbar-info-link');
        if (!slug || slug === activeSlug || !renderMap.has(slug)) return;

        // Hide current
        if (activeSlug && renderMap.has(activeSlug)) {
          renderMap.get(activeSlug).style.display = 'none';
        }

        // Show new
        renderMap.get(slug).style.display = '';

        // Swap active class
        navLinks.forEach((n) => n.classList.remove(ACTIVE_CLASS));
        link.classList.add(ACTIVE_CLASS);

        activeSlug = slug;
      });
    });
  });
};
