export const initNavMobile = async () => {
  // ============================================
  // NAVBAR SYSTEM — CLICK ONLY (All Devices)
  // ============================================

  const ANIMATION_DURATION = 200;
  const INFO_FADE_DURATION = 200;

  const isMobile = window.innerWidth <= 992;

  const links = document.querySelectorAll('[nav-dropdown-link]');
  const cards = document.querySelectorAll('[nav-dropdown-card]');
  const dropdownWrapper = document.querySelector(
    '[nav-dropdown-card="wrapper"]'
  ) as HTMLElement | null;

  const infoLinks = document.querySelectorAll('[navbar-info-link]');
  const infoCards = document.querySelectorAll('[navbar-info-card]');

  let activeCard: HTMLElement | null = null;

  // ——————————————————————————————————
  // Setup Dropdown Cards
  // ——————————————————————————————————

  cards.forEach((card) => {
    if (card.getAttribute('nav-dropdown-card') === 'wrapper') return;

    const el = card as HTMLElement;
    el.style.display = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-15px)';
    el.style.transition = `
      opacity ${ANIMATION_DURATION}ms cubic-bezier(0.25,0.1,0.25,1),
      transform ${ANIMATION_DURATION}ms cubic-bezier(0.25,0.1,0.25,1)
    `;
    el.style.pointerEvents = 'none';
  });

  function updateLinkClasses(activeKey: string | null) {
    links.forEach((l) => {
      const key = l.getAttribute('nav-dropdown-link');

      if (key === activeKey) {
        l.classList.add('is-active');
        l.classList.remove('is-inactive');
      } else if (activeKey) {
        l.classList.remove('is-active');
        l.classList.add('is-inactive');
      } else {
        l.classList.remove('is-active');
        l.classList.remove('is-inactive');
      }
    });
  }

  function openCard(card: HTMLElement, key: string) {
    if (activeCard === card) return;

    if (activeCard) closeCard(activeCard);

    if (dropdownWrapper) dropdownWrapper.style.display = 'block';

    activeCard = card;

    card.style.display = 'flex';
    card.style.pointerEvents = 'auto';

    // 🔑 Only activate default tabs on desktop
    if (!isMobile) {
      resetInfoTabs(card);
    }

    void card.offsetHeight;

    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';

    updateLinkClasses(key);
  }

  function closeCard(card: HTMLElement) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(-15px)';
    card.style.pointerEvents = 'none';

    setTimeout(() => {
      if (card.style.opacity === '0') {
        card.style.display = 'none';
        if (dropdownWrapper) dropdownWrapper.style.display = 'none';
      }
    }, ANIMATION_DURATION);

    activeCard = null;
    updateLinkClasses(null);
  }

  // ——————————————————————————————————
  // Main Nav Click Toggle
  // ——————————————————————————————————

  links.forEach((link) => {
    const key = link.getAttribute('nav-dropdown-link');
    const matchingCard = document.querySelector(
      `[nav-dropdown-card="${key}"]`
    ) as HTMLElement | null;

    if (!matchingCard || key === 'wrapper') return;

    link.addEventListener('click', (e) => {
      if (link.getAttribute('no-mobile-nav')) return;
      e.preventDefault();
      e.stopPropagation();

      const isSameCardOpen = activeCard && activeCard.getAttribute('nav-dropdown-card') === key;

      if (isSameCardOpen) {
        closeCard(activeCard);
        return;
      }

      openCard(matchingCard, key!);
    });
  });

  // ——————————————————————————————————
  // Close On Outside Click
  // ——————————————————————————————————

  document.addEventListener('click', (e) => {
    if (!activeCard) return;

    const clickedInsideLink = [...links].some((l) => l.contains(e.target as Node));

    const clickedInsideCard = activeCard.contains(e.target as Node);

    const clickedInsideWrapper = dropdownWrapper && dropdownWrapper.contains(e.target as Node);

    if (!clickedInsideLink && !clickedInsideCard && !clickedInsideWrapper) {
      closeCard(activeCard);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeCard) {
      closeCard(activeCard);
    }
  });

  // ——————————————————————————————————
  // PART 2: Inner Info Tabs
  // ——————————————————————————————————

  infoCards.forEach((card) => {
    const el = card as HTMLElement;
    const parent = el.parentElement;
    if (parent) parent.style.position = 'relative';

    el.style.transition = `opacity ${INFO_FADE_DURATION}ms ease`;

    // 🔑 Mobile: no default card visible
    if (!isMobile && el.getAttribute('navbar-info-default') === 'active') {
      el.style.position = 'relative';
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';
      el.style.zIndex = '1';
    } else {
      el.style.position = 'absolute';
      el.style.top = '0';
      el.style.left = '0';
      el.style.width = '100%';
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '0';
    }
  });

  function showInfoCard(key: string, parentCard: Element | null) {
    const scope = parentCard || document;

    scope.querySelectorAll('[navbar-info-card]').forEach((c) => {
      const el = c as HTMLElement;
      el.style.position = 'absolute';
      el.style.top = '0';
      el.style.left = '0';
      el.style.width = '100%';
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '0';
    });

    scope.querySelectorAll('[navbar-info-link]').forEach((l) => l.classList.remove('is-active'));

    const targetCard = scope.querySelector(`[navbar-info-card="${key}"]`) as HTMLElement | null;

    const targetLink = scope.querySelector(`[navbar-info-link="${key}"]`);

    if (targetCard) {
      targetCard.style.position = 'relative';
      targetCard.style.opacity = '1';
      targetCard.style.pointerEvents = 'auto';
      targetCard.style.zIndex = '1';
    }

    if (targetLink) targetLink.classList.add('is-active');
  }

  function resetInfoTabs(parentCard: HTMLElement) {
    const defaultCard = parentCard.querySelector(
      '[navbar-info-default="active"]'
    ) as HTMLElement | null;

    if (!defaultCard) return;

    const defaultKey = defaultCard.getAttribute('navbar-info-card');
    showInfoCard(defaultKey!, parentCard);
  }

  infoLinks.forEach((link) => {
    const key = link.getAttribute('navbar-info-link');
    const parentCard = link.closest('[nav-dropdown-card]');
    if (!key || !parentCard) return;

    link.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      const isButtonLink =
        target.closest('.mega-child-item') ||
        target.closest('.mobile-cta') ||
        target.closest('.card-wrapper');

      // 👉 If it's a cta button, item link, or card
      if (isButtonLink) return;

      e.preventDefault();
      e.stopPropagation();

      const isActive = link.classList.contains('is-active');

      if (isActive) {
        parentCard.querySelectorAll('[navbar-info-card]').forEach((c) => {
          const el = c as HTMLElement;
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          el.style.position = 'absolute';
        });

        parentCard
          .querySelectorAll('[navbar-info-link]')
          .forEach((l) => l.classList.remove('is-active'));

        return;
      }

      showInfoCard(key, parentCard);
    });
  });

  // ——————————————————————————————————
  // Mobile Back / Close Buttons
  // ——————————————————————————————————

  const globalNavbar = document.querySelector('.global-navbar');

  const backButtons = document.querySelectorAll('.nav-mobile-button.is-back');
  const closeButtons = document.querySelectorAll('.nav-mobile-button.is-close');

  function closeParentDropdown(button: Element, shouldCloseNavbar = false) {
    const parentCard = button.closest('[nav-dropdown-card]') as HTMLElement | null;
    if (!parentCard) return;

    if (activeCard === parentCard) {
      closeCard(parentCard);
    } else {
      parentCard.style.opacity = '0';
      parentCard.style.pointerEvents = 'none';
      parentCard.style.display = 'none';
    }

    if (shouldCloseNavbar && globalNavbar) {
      globalNavbar.classList.remove('open');
    }
  }

  backButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeParentDropdown(btn, false);
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeParentDropdown(btn, true);
    });
  });

  const mobileNavTrigger = document.querySelector(`[data="mobile-nav"]`);

  const openGlobalNav = () => {
    globalNavbar?.classList.add('open');
    document.body.classList.add('nav-open');
  };

  const closeGlobalNav = () => {
    globalNavbar?.classList.remove('open');
    document.body.classList.remove('nav-open');
  };

  mobileNavTrigger?.addEventListener('click', (e) => {
    if (globalNavbar?.classList.contains('open')) {
      closeGlobalNav();
    } else {
      if (e.target.closest('.navbar-brand')) return;
      openGlobalNav();
    }
  });
};
