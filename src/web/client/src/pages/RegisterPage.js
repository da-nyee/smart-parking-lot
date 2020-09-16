import React from 'react';
import CommonTemplate from '../components/common/CommTemplate';
import RegisterForm from '../containers/auth/RegisterForm';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RegisterPage = ({ history }) => {
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
      <CommonTemplate type="Register">
        <RegisterForm />
      </CommonTemplate>
    );
  } else return null;
};

export default withRouter(RegisterPage);
