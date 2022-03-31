exports.createPages = async ({ actions }) => {
  const { createPage } = actions
  createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
  })
}

const path = require("path")

exports.createPages = async ({graphql, actions}) => {
  const { createPage } = actions

  const pages = await graphql(`
  {
    allPrismicPost {
      nodes {
        id
        uid
      }
    }
  }
`)

  const template = path.resolve("src/templates/post.js")
  pages.data.allPrismicPost.nodes.forEach(post => {
    createPage({
      path: `/blog/${post.uid}`,
      component: template,
      context: {
        uid: post.uid,
      }
    })
  })
}