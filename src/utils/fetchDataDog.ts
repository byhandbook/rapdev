import { fetchPageData } from './fetchPageData';

export const fetchDataDog = async () => {
  // fetch regular link blocks
  const doc = await fetchPageData(`/bedrock-project-2026/datado`);
  // Grab the element
  const megaCardRight = doc.querySelector(`[nav-dropdown-card="datadog"]`);

  // fetch datadog marketplace
  const marketPlaceIntegrationsDoc = await fetchPageData(
    `/bedrock-project-2026/datadog-marketplace-integrations`
  );
  // grab the element
  const marketPlaceIntegrationsEl = marketPlaceIntegrationsDoc.querySelector(`[data="dd-int-el"]`);

  // grab the parent to inject this in, inside megaCardRight
  const marketPLaceIntegrationsParent = megaCardRight?.querySelector(`[data="dd-int-parent"]`);
  marketPLaceIntegrationsParent?.appendChild(marketPlaceIntegrationsEl);

  return megaCardRight;
};
