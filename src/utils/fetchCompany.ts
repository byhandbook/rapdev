import { fetchPageData } from './fetchPageData';

export const fetchCompany = async () => {
  // fetch page
  const companyDoc = await fetchPageData('/bedrock-project-2026/company');

  // grab the element
  const elementToFetch = companyDoc.querySelector(`[nav-dropdown-card="company"]`);

  return elementToFetch;
};
