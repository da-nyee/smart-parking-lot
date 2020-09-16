import React from 'react';
import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';
import { Link } from 'react-router-dom';

const buttonStyle = css`
  border: none;
  border-radius: 4px;
  font-size: 1.5rem;
  font-weitgh: bold;
  padding: 0.25rem 1rem;
  color: white;
  outline: none;
  cursor: pointer;

  background: ${palette.gray[8]};
  &:hover {
    background: ${palette.gray[6]};
  }

  ${(props) =>
    props.flex &&
    css`
      flex: 1;
      height: 6rem;
    `};

  ${(props) =>
    props.cyan &&
    css`
      background: ${palette.cyan[5]};
      &:hover {
        background: ${palette.cyan[4]};
      }
    `};

  ${(props) =>
    props.red &&
    css`
      background: red;
      &:hover {
        background: #ee0000;
      }
    `};

  ${(props) =>
    props.to &&
    css`
      display: flex;
      justify-content: center;
      items-align: center;
    `};

  ${(props) =>
    props.login &&
    css`
      font-size: 1.25rem;
    `};
`;

const StyledButton = styled.button`
  ${buttonStyle}
`;

const StyledLink = styled(Link)`
  ${buttonStyle};
`;

const Button = (props) => {
  return props.to ? (
    <StyledLink {...props} cyan={props.cyan ? 1 : 0} />
  ) : (
    <StyledButton {...props} />
  );
};

export default Button;
