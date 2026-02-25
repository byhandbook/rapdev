import { fetchPageData } from './fetchPageData';

export const fetchResources = async () => {
  // fetch page
  const resourcesDoc = await fetchPageData('/bedrock-project-2026/resources');

  // grab the element
  const elementToFetch = resourcesDoc.querySelector(`[nav-dropdown-card="resources"]`);

  return elementToFetch;
};
