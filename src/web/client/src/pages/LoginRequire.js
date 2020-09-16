import React from 'react';
import AuthTemplate from '../components/auth/AuthTemplate';
import Button from '../components/common/Button';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ErrorMessage = styled.div`
  font-size: 3rem;
  margin-bottom: 2rem;
  color: red;
`;

const LoginRequirePage = ({ history }) => {
  const { user } = useSelector(({ user }) => ({
    user: user.user,
  }));
  if (user) {
    history.push('/alreadyLogin');

    return null;
  }

  return (
    <AuthTemplate>
      <ErrorMessage>로그인이 필요합니다.</ErrorMessage>
      <Button to="/login" cyan>
        확인
      </Button>
    </AuthTemplate>
  );
};

export default withRouter(LoginRequirePage);
