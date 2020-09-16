import styled, { css } from 'styled-components';
import React from 'react';

const StyledDiv = styled.div`
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 8rem;
  background: white;
  border-radius: 2px;

  ${(props) =>
    props.flex &&
    css`
      display: flex;
      padding: 3rem;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `}
`;

const WhiteBox = (props) => <StyledDiv {...props} />;

export default WhiteBox;
