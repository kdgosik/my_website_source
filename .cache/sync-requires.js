const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---src-templates-blog-post-template-js": hot(preferDefault(require("/www/src/templates/blog-post-template.js"))),
  "component---cache-dev-404-page-js": hot(preferDefault(require("/www/.cache/dev-404-page.js"))),
  "component---src-pages-404-js": hot(preferDefault(require("/www/src/pages/404.js"))),
  "component---src-pages-about-js": hot(preferDefault(require("/www/src/pages/about.js"))),
  "component---src-pages-blog-index-js": hot(preferDefault(require("/www/src/pages/blog/index.js"))),
  "component---src-pages-index-js": hot(preferDefault(require("/www/src/pages/index.js"))),
  "component---src-pages-page-2-js": hot(preferDefault(require("/www/src/pages/page-2.js"))),
  "component---src-pages-privacy-js": hot(preferDefault(require("/www/src/pages/privacy.js"))),
  "component---src-pages-terms-js": hot(preferDefault(require("/www/src/pages/terms.js")))
}

