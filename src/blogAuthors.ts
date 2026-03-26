window.Webflow ||= [];
window.Webflow.push(() => {
  const blogAuthorContents = document.querySelectorAll(`[more="author-content"]`);
  const blogPostsWithAuthors = document.querySelectorAll(`[data="post"]`);

  blogAuthorContents.forEach((eachBlogAuthorContent) => {
    const authorName = eachBlogAuthorContent
      .querySelector(`[more="auth-name"]`)
      ?.textContent.trim();

    const authExpand = eachBlogAuthorContent.querySelector(`[more="auth-expand"]`);

    blogPostsWithAuthors.forEach((eachPost) => {
      const postAuthors = eachPost.querySelectorAll(`[data="auth-name"]`);

      postAuthors.forEach((author) => {
        if (author.textContent.trim() === authorName) {
          const authPost = eachPost.querySelector(`[data="auth-post"]`);
          console.log(authExpand, 'AUTH EXPAND');
          if (authPost && authExpand) {
            authExpand.append(authPost.cloneNode(true));
          }
        }
      });
    });
  });
});
