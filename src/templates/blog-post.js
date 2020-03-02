import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Timestamp } from '../components/Misc';
import unified from 'unified';
import markdown from 'remark-parse';
import html from 'remark-html';

export default ({ data }) => {
  const post = data.airtable
  return (
    <Layout>
      <h1>{post.data.title}</h1>
      <Timestamp>{post.data.date}</Timestamp>
      <h5>Written by {post.data.author}</h5>
      <img
        src={post.data.image[0].url}
        style={{
          display: 'block',
          marginBottom: '1rem',
          marginTop: '1rem',
          width: '100%',
          height: 'auto'
        }}
        alt=""
        />
        <div
        dangerouslySetInnerHTML={{
          __html: unified()
          .use(markdown)
          .use(html)
          .processSync(post.data.PostMarkdown.raw)
          }}
          />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    airtable(data: { slug: { eq: $slug } }) {
      data{
        slug
        title
        author
        PostMarkdown {
          raw
        }
        image {
          url
        }
        date
      }
    }
  }
`