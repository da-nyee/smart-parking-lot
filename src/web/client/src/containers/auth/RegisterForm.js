import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeField, initializeForm, register } from '../../modules/auth';
import SettingForm from '../../components/setting/SettingForm';
import { withRouter } from 'react-router-dom';
import { logout } from '../../modules/user';

const RegisterForm = ({ history }) => {
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.register,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));

  const onChange = useCallback(
    (e) => {
      const { value, name } = e.target;

      dispatch(
        changeField({
          form: 'register',
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

      const { oldPassword, newPassword, newConfirm } = form;
      if ([oldPassword, newPassword, newConfirm].includes('')) {
        return;
      }
      if (newPassword !== newConfirm) {
        dispatch(initializeForm('register'));

        return;
      }

      const { username } = user;

      dispatch(register({ username, oldPassword, newPassword }));
    },
    [dispatch, form, user]
  );

  useEffect(() => {
    dispatch(initializeForm('register'));
  }, [dispatch]);

  useEffect(() => {
    if (authError) {
      if (authError.response.status === 401) {

        return;
      }

      return;
    }
    if (
      form.oldPassword !== '' &&
      form.newPassword !== '' &&
      form.newConfirm !== '' &&
      auth
    ) {
      dispatch(logout());
    }
  }, [auth, authError, dispatch, form]);

  return (
    <SettingForm
      type="register"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
};

export default withRouter(RegisterForm);
