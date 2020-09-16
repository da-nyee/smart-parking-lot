import styled from 'styled-components';

export const FormWrapper = styled.div`
  flex: 6;
  margin-right: 0.5rem;
`;

export const Form = styled.form`
  display: flex;
`;

export const FormBlock = styled.div`
  display: flex;
  & + & {
    margin-top: 1rem;
  }
`;
