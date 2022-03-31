import React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import {graphql, Link} from "gatsby";

const BlogPage = ({data}) => (
    <Layout>
        <Seo title={'Blog'}/>
        <h1>Blog page</h1>
        {data.allPrismicPost.edges.map(post => {
            return <div key={post.node.uid}>
                <h3>{post.node.data.title.text}</h3>
                <br/>
                <Link to={`${post.node.uid}`}>Открыть</Link>
            </div>
        })}
    </Layout>
)

export const pageQuery = graphql`
query PostsQuery {
  allPrismicPost {
    edges {
      node {
        data {
          title {
            text
          }
        }
        uid
      }
    }
  }
}
`
/*export const pageQuery = graphql`
query MyQuery {
  allPrismicPost {
    edges {
      node {
        id
        uid
      }
    }
  }
}
`*/

export default BlogPage