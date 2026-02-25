import { fetchPageData } from './fetchPageData';

export const fetchServiceNow = async () => {
  // fetch regular link blocks
  const doc = await fetchPageData(`/bedrock-project-2026/servicenow`);
  // Grab the element
  const elementToFetch = doc.querySelector(`[nav-dropdown-card="servicenow"]`);

  // fetch servicenow store
  const additionalCollectionDoc = await fetchPageData(`/bedrock-project-2026/servicenow-store`);

  // grab the element
  const additionalCollectionEl = additionalCollectionDoc.querySelector(`[data="sn-store-el"]`);

  // grab the parent to inject this in, inside Service Now Store parent
  const serviceNowStoreParent = elementToFetch?.querySelector(`[data="sn-store-parent"]`);
  serviceNowStoreParent?.appendChild(additionalCollectionEl);

  return elementToFetch;
};
