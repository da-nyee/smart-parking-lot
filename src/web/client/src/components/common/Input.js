import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';

const StyledInput = styled.input`
  font-size: 1.5rem;
  border: 1px solid ${palette.gray[5]};
  outline: none;
  flex: 1;
  padding: 0.3rem;
`;

const Input = (props) => <StyledInput {...props} />;

export default Input;
