import React from 'react'
import { graphql, Link } from 'gatsby'
import { withAuthenticator, Connect } from 'aws-amplify-react'
import { graphqlOperation } from 'aws-amplify'

import Layout from '../components/Layout'
import { listPostLikes } from '../graphql/queries'

const Dashboard = props => (
  <Layout {...props} title="Gatsby Starter Blog" isDashboard>
    <h1>Liked Posts</h1>
    <Connect query={graphqlOperation(listPostLikes)}>
      {({ data: { listPostLikes }, loading, error }) => {
        if (error) return <h3>Error</h3>
        if (loading) return <h3>Loading...</h3>

        return listPostLikes.items.length ? (
          listPostLikes.items.map(item => {
            const { node: post } = props.data.allMarkdownRemark.edges.find(
              ({ node }) => node.frontmatter.id === item.postId
            )
            return post ? (
              <h3 key={post.id}>
                <Link to={`/${post.fields.slug}`}>
                  {post.frontmatter.title}
                </Link>
              </h3>
            ) : null
          })
        ) : (
          <h3>No Liked Posts Yet!</h3>
        )
      }}
    </Connect>
  </Layout>
)

export default withAuthenticator(Dashboard, true)

export const query = graphql`
  {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            id
            title
          }
        }
      }
    }
  }
`
