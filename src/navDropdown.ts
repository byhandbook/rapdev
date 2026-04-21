window.Webflow ||= [];
window.Webflow.push(() => {
  const dropdownBlock = document.querySelector(`[data="dd-block"]`);
  const dropdownHeader = document.querySelector(`[data="dd-header"]`);
  const dropdownTable = document.querySelector(`[data="dd-table"]`);

  dropdownBlock?.addEventListener('click', () => {
    if (dropdownHeader?.classList.contains('active')) {
      dropdownHeader.classList.remove('active');
      dropdownTable?.classList.remove('active');
    } else {
      dropdownHeader?.classList.add('active');
      dropdownTable?.classList.add('active');
    }
  });
});
