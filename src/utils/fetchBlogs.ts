import { fetchPageData } from './fetchPageData';

export const fetchBlogs = async () => {
  // fetch page
  const blogDoc = await fetchPageData('/bedrock-project-2026/blog');

  // grab the element
  const elementToFetch = blogDoc.querySelector(`[nav-dropdown-card="blog"]`);

  return elementToFetch;
};
