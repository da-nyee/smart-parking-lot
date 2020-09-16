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

const AlreadyLoginPage = ({ history }) => {
  const { user, loading } = useSelector(({ user, loading }) => ({
    user: user.user,
    loading: loading['user/CHECK'],
  }));
  if (!user) {
    history.push('/loginRequire');

    return null;
  }

  if (!loading) {
    return (
      <AuthTemplate>
        <ErrorMessage>이미 로그인 중입니다.</ErrorMessage>
        {/*TODO:매출관리 페이지로 리다이렉트*/}
        <Button to="/" cyan>
          확인
        </Button>
      </AuthTemplate>
    );
  } else return null;
};

export default withRouter(AlreadyLoginPage);
