import React, { useEffect, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeField, initializeForm, login } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import { check } from '../../modules/user';
import { withRouter } from 'react-router-dom';

const LoginForm = ({ history }) => {
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.login,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));

  const onChange = useCallback(
    (e) => {
      const { value, name } = e.target;

      dispatch(
        changeField({
          form: 'login',
          key: name,
          value,
        })
      );
    },
    [dispatch]
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const { username, password } = form;
      dispatch(login({ username, password }));
    },
    [form, dispatch]
  );

  useEffect(() => {
    dispatch(initializeForm('login'));
  }, [dispatch]);

  useEffect(() => {
    if (authError) {
        console.log('error');

      return;
    }
    if (auth) {
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  useEffect(() => {
    if (user) {
      history.push('/graph');

      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.log('localStorage is not working');
      }
    }
  }, [history, user]);

  return <AuthForm form={form} onChange={onChange} onSubmit={onSubmit} />;
};

export default withRouter(LoginForm);
