import React from "react"
import { css } from "@emotion/core"
import { Link, graphql } from "gatsby"
import { rhythm } from "../utils/typography"
import Layout from "../components/layout"

export default ({ data }) => {
  return (
    <Layout>
      <div>
        <h1
          css={css`
            display: inline-block;
            border-bottom: 1px solid;
          `}
        >
          Airtable Testing!
        </h1>
        <h4>{data.allAirtable.totalCount} Posts</h4>
        {data.allAirtable.edges.map(({ node }) => (
          <div key={node.id}>
            <Link
              to={node.data.slug}
              css={css`
                text-decoration: none;
                color: inherit;
              `}
            >
              <h3
                css={css`
                  margin-bottom: ${rhythm(1 / 4)};
                `}
              >
                {node.data.title}{" "}
                <span
                  css={css`
                    color: #555;
                  `}
                >
                  — {node.data.date}
                </span>
              </h3>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allAirtable(sort: { fields: [data___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          data {
            title
            date(formatString: "DD MMMM, YYYY")
            slug
          }
        }
      }
    }
  }
`