window.Webflow ||= [];
window.Webflow.push(() => {
  const dropdownBlock = document.querySelector(`[data="dd-block"]`);
  const dropdownHeader = document.querySelector(`[data="dd-header"]`);
  const dropdownTable = document.querySelector(`[data="dd-table"]`);
  console.log(dropdownBlock);
  dropdownBlock?.addEventListener('click', () => {
    console.log(dropdownHeader, dropdownTable);
    if (dropdownHeader?.classList.contains('active')) {
      dropdownHeader.classList.remove('active');
      dropdownTable?.classList.remove('active');
    } else {
      dropdownHeader?.classList.add('active');
      dropdownTable?.classList.add('active');
    }
  });
});
