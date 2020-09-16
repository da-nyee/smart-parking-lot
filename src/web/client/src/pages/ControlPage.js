import React from 'react';
import CommonTemplate from '../components/common/CommTemplate';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ChangeStatusForm from '../containers/control/ChangeStatusForm';

const ControlPage = ({ history }) => {
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
      <CommonTemplate type="Control">
        <ChangeStatusForm />
      </CommonTemplate>
    );
  } else return null;
};

export default withRouter(ControlPage);
