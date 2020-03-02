// import React from 'react';
import styled from '@emotion/styled';
import { css } from "@emotion/core";

const timestamp = css`
  color: #767676;
  font-size: 0.9rem;
  font-family: 'Cousine', monospace;
  margin: 0 0 4px;
`;

const Timestamp = styled.time`
  ${timestamp};
`;

export { Timestamp };