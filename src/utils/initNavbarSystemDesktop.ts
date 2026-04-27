export const initNavDesktop = async () => {
  // ============================================
  // NAVBAR SYSTEM — DESKTOP ONLY
  // ============================================

  const ANIMATION_DURATION = 400;
  const CLOSE_DELAY = 200;
  const INFO_FADE_DURATION = 200;

  // ——————————————————————————————————
  // PART 1: Desktop Dropdown Cards
  // ——————————————————————————————————

  const links = document.querySelectorAll('[nav-dropdown-link]');
  const cards = document.querySelectorAll('[nav-dropdown-card]');
  const dropdownWrapper = document.querySelector('[nav-dropdown-card="wrapper"]');
  const infoLinks = document.querySelectorAll('[navbar-info-link]');
  const infoCards = document.querySelectorAll('[navbar-info-card]');

  let activeCard: HTMLElement | null = null;
  let closeTimeout: any = null;
  let clickLocked = false;

  function updateLinkClasses(activeKey: string) {
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

  function clearLinkClasses() {
    links.forEach((l) => {
      l.classList.remove('is-active');
      l.classList.remove('is-inactive');
    });
  }

  function setInfoCardInitialState(el: HTMLElement) {
    const parent = el.parentElement;
    if (parent) parent.style.position = 'relative';
    el.style.transition = `opacity ${INFO_FADE_DURATION}ms ease`;

    if (el.getAttribute('navbar-info-default') === 'active') {
      el.style.position = 'relative';
      el.style.width = '';
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
  }

  cards.forEach((card) => {
    if (card.getAttribute('nav-dropdown-card') === 'wrapper') return;

    const el = card as HTMLElement;
    el.style.display = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-15px)';
    el.style.transition = `opacity ${ANIMATION_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1), transform ${ANIMATION_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
    el.style.pointerEvents = 'none';
  });

  function openCard(card: HTMLElement) {
    if (activeCard === card) return;

    if (activeCard) closeCardInstant(activeCard);

    if (dropdownWrapper) {
      (dropdownWrapper as HTMLElement).style.display = 'block';
    }

    activeCard = card;
    card.style.display = 'flex';
    card.style.pointerEvents = 'auto';

    resetInfoTabs(card);
    void card.offsetHeight;

    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }

  function closeCard(card: HTMLElement) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(-15px)';
    card.style.pointerEvents = 'none';

    if (activeCard === card) {
      activeCard = null;
      clickLocked = false;
      clearLinkClasses();
    }
    document.querySelectorAll('.navbar-underline').forEach((eachItem) => {
      eachItem.classList.remove('active');
    });
    setTimeout(() => {
      if (card.style.opacity === '0') {
        card.style.display = 'none';
        if (!activeCard && dropdownWrapper) {
          (dropdownWrapper as HTMLElement).style.display = 'none';
        }
      }
    }, ANIMATION_DURATION);
  }

  function closeCardInstant(card: HTMLElement) {
    card.style.display = 'none';
    card.style.opacity = '0';
    card.style.transform = 'translateY(-15px)';
    card.style.pointerEvents = 'none';

    if (activeCard === card) {
      activeCard = null;
      clickLocked = false;
    }

    if (!activeCard && dropdownWrapper) {
      (dropdownWrapper as HTMLElement).style.display = 'none';
    }
  }

  function resetAllDropdownCardsClosed() {
    cards.forEach((card) => {
      if (card.getAttribute('nav-dropdown-card') === 'wrapper') return;
      const el = card as HTMLElement;
      el.style.display = 'none';
      el.style.opacity = '0';
      el.style.transform = 'translateY(-15px)';
      el.style.pointerEvents = 'none';
    });
    if (dropdownWrapper) {
      (dropdownWrapper as HTMLElement).style.display = 'none';
    }
    infoCards.forEach((c) => setInfoCardInitialState(c as HTMLElement));
    infoLinks.forEach((l) => l.classList.remove('is-active'));
    activeCard = null;
    clickLocked = false;
    clearLinkClasses();
    document.querySelectorAll('.navbar-underline').forEach((eachItem) => {
      eachItem.classList.remove('active');
    });
  }

  function cancelClose() {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
  }

  function scheduleClose(card: HTMLElement) {
    if (clickLocked) return;
    closeTimeout = setTimeout(() => closeCard(card), CLOSE_DELAY);
  }

  const interactiveCards = [...cards].filter(
    (c) => c.getAttribute('nav-dropdown-card') !== 'wrapper'
  ) as HTMLElement[];

  links.forEach((link) => {
    const key = link.getAttribute('nav-dropdown-link');
    const matchingCard = document.querySelector(
      `[nav-dropdown-card="${key}"]`
    ) as HTMLElement | null;

    link.addEventListener('mouseenter', () => {
      cancelClose();

      if (clickLocked) {
        clickLocked = false;
        clearLinkClasses();
      }

      // Handle wrapper link underline
      if (key === 'wrapper') {
        return;
      }

      if (matchingCard) {
        document.querySelectorAll('.navbar-underline').forEach((eachItem) => {
          eachItem.classList.remove('active');
        });
        const underline = link.querySelector('.navbar-underline');
        underline?.classList.add('active');
        openCard(matchingCard);
      }
    });

    link.addEventListener('mouseleave', () => {
      // remove underline state
      if (key === 'wrapper') {
        return;
      }

      if (matchingCard) {
        // const underline = link.querySelector('.navbar-underline');
        // underline?.classList.remove('active');
        scheduleClose(matchingCard);
      }
    });

    link.addEventListener('click', (e) => {
      if (key === 'wrapper' || (e.target as HTMLElement).closest('[nav-dropdown-link]')) return;

      e.preventDefault();
      e.stopPropagation();
      cancelClose();

      if (activeCard === matchingCard && clickLocked) {
        clickLocked = false;
        closeCard(matchingCard);
      } else {
        openCard(matchingCard);
        clickLocked = true;
        updateLinkClasses(key!);
      }
    });
  });

  if (dropdownWrapper) {
    dropdownWrapper.addEventListener('mouseenter', cancelClose);
    dropdownWrapper.addEventListener('mouseleave', () => {
      if (activeCard) scheduleClose(activeCard);
    });
  }

  document.addEventListener('click', (e) => {
    if (!activeCard) return;

    const clickedInsideLink = [...links].some((l) => l.contains(e.target as Node));
    const clickedInsideCard = interactiveCards.some((c) => c.contains(e.target as Node));
    const clickedInsideWrapper = dropdownWrapper && dropdownWrapper.contains(e.target as Node);

    if (!clickedInsideLink && !clickedInsideCard && !clickedInsideWrapper) {
      clickLocked = false;
      closeCard(activeCard);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeCard) {
      clickLocked = false;
      closeCard(activeCard);
    }
  });

  // Same-page anchor links do not unload the page, so force nav close/reset.
  document.addEventListener(
    'click',
    (e) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      let isSamePageAnchor = href.indexOf('#') === 0;
      if (!isSamePageAnchor) {
        const resolved = new URL(anchor.href, window.location.href);
        isSamePageAnchor =
          resolved.origin === window.location.origin &&
          resolved.pathname === window.location.pathname &&
          resolved.search === window.location.search &&
          resolved.hash.length > 0;
      }

      if (!isSamePageAnchor) return;

      const clickedInsideNav =
        !!anchor.closest('[nav-dropdown-card]') ||
        !!anchor.closest('[nav-dropdown-link]') ||
        (!!dropdownWrapper && dropdownWrapper.contains(anchor));

      if (!clickedInsideNav) return;
      resetAllDropdownCardsClosed();
    },
    true
  );

  // If the URL hash changes without a full page navigation, still force a full nav reset.
  window.addEventListener('hashchange', () => {
    resetAllDropdownCardsClosed();
  });

  // ——————————————————————————————————
  // PART 2: Desktop Inner Info Tabs (Crossfade)
  // ——————————————————————————————————

  infoCards.forEach((card) => {
    setInfoCardInitialState(card as HTMLElement);
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
      targetCard.style.width = '';
      targetCard.style.opacity = '1';
      targetCard.style.pointerEvents = 'auto';
      targetCard.style.zIndex = '1';
    }

    if (targetLink) targetLink.classList.add('is-active');
  }

  function resetInfoTabs(parentCard: HTMLElement) {
    parentCard.querySelectorAll('[navbar-info-card]').forEach((c) => {
      const el = c as HTMLElement;
      el.style.position = 'absolute';
      el.style.top = '0';
      el.style.left = '0';
      el.style.width = '100%';
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '0';
    });

    parentCard
      .querySelectorAll('[navbar-info-link]')
      .forEach((l) => l.classList.remove('is-active'));

    const defaultCard = parentCard.querySelector(
      '[navbar-info-default="active"]'
    ) as HTMLElement | null;

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
      showInfoCard(key!, link.closest('[nav-dropdown-card]'));
    });
  });
};
