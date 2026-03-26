document.addEventListener('DOMContentLoaded', () => {
  const mqTablet = window.matchMedia('(max-width: 991px)');
  let fsInstance = null;

  /* ------------------------------------------------
  DROPDOWN POSITION SWITCH
  ------------------------------------------------ */

  const SortDropdown = {
    init() {
      const dropdown = document.querySelector('#sort-dropdown');
      const mobileContainer = document.querySelector('#mobile-sorting-options');
      const originalParent = document.querySelector('#sort-dropdown-wrapper');

      if (!dropdown || !mobileContainer || !originalParent) return;

      const moveDropdown = (e) => {
        if (e.matches) {
          mobileContainer.appendChild(dropdown);
        } else {
          originalParent.appendChild(dropdown);
        }
      };

      moveDropdown(mqTablet);
      mqTablet.addEventListener('change', moveDropdown);
    },
  };

  /* ------------------------------------------------
  MOBILE FILTER MODAL
  ------------------------------------------------ */

  const MobileFilters = {
    initialized: false,
    snapshotState: null,
    clearUsed: false,
    elements: {},

    init() {
      if (!mqTablet.matches || this.initialized) return;

      const modal = document.querySelector('#filters-modal');
      const openBtn = document.querySelector('#modal-open-button');
      const closeBtn = document.querySelector('#modal-close-button');
      const applyBtn = document.querySelector('#modal-apply-filters');
      const clearBtn = document.querySelector('#clear-button');
      const totalFilters = document.querySelector('#total-filters');
      const totalWrapper = document.querySelector('#total-filters-wrapper');
      const menuIcon = document.querySelector('#filters-menu-icon');

      if (
        !modal ||
        !openBtn ||
        !closeBtn ||
        !applyBtn ||
        !clearBtn ||
        !totalFilters ||
        !totalWrapper ||
        !menuIcon
      ) {
        return;
      }

      this.elements = {
        modal,
        openBtn,
        closeBtn,
        applyBtn,
        clearBtn,
        totalFilters,
        totalWrapper,
        menuIcon,
      };

      this.initialized = true;

      this.bindEvents();
      this.updateFilterCount();
    },

    bindEvents() {
      const { modal, openBtn, closeBtn, applyBtn, clearBtn } = this.elements;

      openBtn.addEventListener('click', () => {
        this.clearUsed = false;
        this.takeSnapshot();
        modal.style.display = 'block';
      });

      applyBtn.addEventListener('click', () => {
        if (fsInstance) fsInstance.applyFilters();
        this.clearUsed = false;
        modal.style.display = 'none';
        this.updateFilterCount();
      });

      clearBtn.addEventListener('click', () => {
        if (fsInstance) fsInstance.resetFilters();
        this.clearUsed = true;
        this.updateFilterCount();
        applyBtn.disabled = false;
      });

      closeBtn.addEventListener('click', () => {
        if (!this.clearUsed) this.restoreSnapshot();
        this.clearUsed = false;
        modal.style.display = 'none';
        this.updateFilterCount();
      });

      modal.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
          this.updateFilterCount();
          applyBtn.disabled = !this.hasChangedFromSnapshot();
        }
      });
    },

    getActiveFilterCount() {
      if (!this.elements.modal) return 0;

      const { modal } = this.elements;

      if (!fsInstance) {
        return modal.querySelectorAll('input[type="checkbox"]:checked').length;
      }

      return [...fsInstance.filtersData.values()].reduce(
        (total, values) => total + values.activeValues.size,
        0
      );
    },

    updateFilterCount() {
      const { totalFilters, totalWrapper, menuIcon } = this.elements;

      if (!totalFilters || !totalWrapper || !menuIcon) return;

      const count = this.getActiveFilterCount();

      totalFilters.textContent = count;
      totalWrapper.style.display = count > 0 ? 'flex' : 'none';
      menuIcon.style.display = count > 0 ? 'none' : 'block';
    },

    takeSnapshot() {
      const { modal, applyBtn } = this.elements;
      if (!modal) return;

      if (fsInstance) {
        this.snapshotState = new Map();

        fsInstance.filtersData.forEach((data, key) => {
          this.snapshotState.set(key, new Set(data.activeValues));
        });
      } else {
        const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
        this.snapshotState = [...checkboxes].map((cb) => cb.checked);
      }

      applyBtn.disabled = true;
    },

    restoreSnapshot() {
      if (!this.snapshotState) return;

      const { modal } = this.elements;
      if (!modal) return;

      if (fsInstance && this.snapshotState instanceof Map) {
        fsInstance.filtersData.forEach((data, key) => {
          const saved = this.snapshotState.get(key) || new Set();

          data.elements.forEach((el) => {
            const value = el.value;
            const shouldBeActive = saved.has(value);
            const isActive = data.activeValues.has(value);

            if (shouldBeActive !== isActive) {
              el.element.click();
            }
          });
        });

        fsInstance.applyFilters();
      } else {
        const checkboxes = modal.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach((cb, i) => {
          if (cb.checked !== this.snapshotState[i]) cb.click();
        });
      }
    },

    hasChangedFromSnapshot() {
      const { modal } = this.elements;

      if (!modal || !this.snapshotState) return false;

      if (fsInstance && this.snapshotState instanceof Map) {
        for (const [key, data] of fsInstance.filtersData) {
          const saved = this.snapshotState.get(key) || new Set();

          if (saved.size !== data.activeValues.size) return true;

          for (const v of data.activeValues) {
            if (!saved.has(v)) return true;
          }
        }

        return false;
      }

      const checkboxes = modal.querySelectorAll('input[type="checkbox"]');

      return [...checkboxes].some((cb, i) => cb.checked !== this.snapshotState[i]);
    },
  };

  /* ------------------------------------------------
  FINsweet LIST HOOK
  ------------------------------------------------ */

  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    'list',
    (listInstances) => {
      const listInstance = listInstances[1];
      if (!listInstance) return;

      listInstance.addHook('afterRender', (items) => {
        if (!listInstance.hasInteracted.value) return items;

        MobileFilters.updateFilterCount();

        return items;
      });
    },
  ]);

  /* ------------------------------------------------
  INITIALIZATION
  ------------------------------------------------ */

  SortDropdown.init();
  MobileFilters.init();

  mqTablet.addEventListener('change', () => {
    MobileFilters.init();
  });
});
