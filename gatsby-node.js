const parseFilepath = require('parse-filepath');
const path = require('path');
const slash = require('slash');
const graphql = require('gatsby');

exports.onCreateWebpackConfig = ({ 
  stage,
  actions,
 }) => {
  switch (stage) {
    case 'develop':
      actions.setWebpackConfig({
        module: {
          rules: [
            {
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              use: 'eslint-loader',
            },
          ],
        },
      });
    break;
  }
};

// exports.onCreateWebpackConfig = ({
//   stage,
//   rules,
//   loaders,
//   plugins,
//   actions,
// }) => {
//   actions.setWebpackConfig({
//     module: {
//       rules: [
//         {
//           test: /\.less$/,
//           use: [
//             // You don't need to add the matching ExtractText plugin
//             // because gatsby already includes it and makes sure it's only
//             // run at the appropriate stages, e.g. not in development
//             loaders.miniCssExtract(),
//             loaders.css({ importLoaders: 1 }),
//             // the postcss loader comes with some nice defaults
//             // including autoprefixer for our configured browsers
//             loaders.postcss(),
//             `less-loader`,
//           ],
//         },
//       ],
//     },
//     plugins: [
//       plugins.define({
//         __DEVELOPMENT__: stage === `develop` || stage === `develop-html`,
//       }),
//     ],
//   })
// }





exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators;
  if (node.internal.type === 'airtable') {
    const fileNode = getNode(node.parent);
    const parsedFilePath = parseFilepath(fileNode.relativePath);

    const slug = `/${parsedFilePath.dir}`;
    createNodeField({ node, name: 'slug', value: slug });
  }
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;
  return new Promise((resolve, reject) => {
    const blogPostTemplate = path.resolve(
      'src/templates/blog-post-template.js'
    );
    resolve(
      graphql(
        `
          {
            allAirtable {
              edges {
                node {
                  data{
                    slug
                  }
                }
              }
            }
          }
      `
      ).then(result => {
        if (result.error) {
          reject(result.error);
        }

        result.data.allAirtable.edges.forEach(edge => {
          createPage({
            path: `${edge.node.slug}`,
            component: slash(blogPostTemplate),
            context: {
              slug: edge.node.slug
            }
          });
        });
      })
    );
  });
};
