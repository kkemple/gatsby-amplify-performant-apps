import React from 'react'
import { Link, graphql } from 'gatsby'
import { Auth, API, graphqlOperation } from 'aws-amplify'
import { Connect } from 'aws-amplify-react'
import uuid from 'uuid'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { rhythm, scale } from '../utils/typography'
import { listPostLikes, getPostLike } from '../graphql/queries'
import { createPostLike, deletePostLike } from '../graphql/mutations'

class BlogPostTemplate extends React.Component {
  state = {
    isLoggedIn: false,
    liked: null,
  }

  componentDidMount = async () => {
    const post = this.props.data.markdownRemark
    const user = await Auth.currentAuthenticatedUser()
    const { data } = await API.graphql(
      graphqlOperation(listPostLikes, {
        filter: { postId: { eq: post.frontmatter.id } },
      })
    )
    const like = data.listPostLikes.items[0]

    this.setState({ isLoggedIn: !!user, like })
  }

  toggleLike = async () => {
    const post = this.props.data.markdownRemark

    if (this.state.like) {
      await API.graphql(
        graphqlOperation(deletePostLike, {
          input: { id: this.state.like.id },
        })
      )
      this.setState({ like: null })
    } else {
      const like = {
        postId: post.frontmatter.id,
        id: uuid(),
      }

      await API.graphql(
        graphqlOperation(createPostLike, {
          input: like,
        })
      )
      this.setState({ like })
    }
  }

  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext
    const { isLoggedIn, likesPost } = this.state

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={post.frontmatter.title} description={post.excerpt} />
        <h1>{post.frontmatter.title}</h1>
        {isLoggedIn && (
          <div>
            <button onClick={this.toggleLike}>
              {this.state.like ? 'Unlike' : 'Like'}
            </button>
          </div>
        )}
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
          }}
        >
          {post.frontmatter.date}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <Bio />

        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        id
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
