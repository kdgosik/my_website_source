/* eslint-disable no-undef, react/prop-types, react/no-danger */
import unified from 'unified';
import markdown from 'remark-parse';
import html from 'remark-html';
import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
// import styled from 'react-emotion';
import styled from '@emotion/styled';
import { Box } from '../components/Layout';
import { Timestamp, Link } from '../components/Misc';

const Back = styled.div`
  color: #666;
  float: right;
  position: relative;
  bottom: 1.5rem;
`;

const Template = () => {
  const post = useStaticQuery(graphql`
    query BlogPostByPath($slug: String!) {
      airtable(data: {slug: { eq: $slug }}) {
        data {
          slug
          title
          author
          PostMarkdown
          image {
            url
          }
          date
        }
      }
    }
  `);

  return (
    <Box>
      <Box
        width={[1, 1, 720]}
        m={['3.5rem 0 0 0', '3.5rem 0 0 0', '3.5rem auto 0 auto']}
        px={[3, 3, 0]}
        style={{ overflow: 'visible' }}
      >
        <Back>
          <Link to="/blog">&larr; Blog</Link>
        </Back>
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
              .processSync(post.PostMarkdown)
          }}
        />
      </Box>
    </Box>
  );
};


export default Template;