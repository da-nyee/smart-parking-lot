import React from 'react';
import CommonTemplate from '../components/common/CommTemplate';
import EditPeriodForm from '../containers/setting/EditPeriodForm';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EditPeriodPage = ({ history }) => {
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
      <CommonTemplate type="EditPeriod">
        <EditPeriodForm />
      </CommonTemplate>
    );
  } else return null;
};

export default withRouter(EditPeriodPage);
