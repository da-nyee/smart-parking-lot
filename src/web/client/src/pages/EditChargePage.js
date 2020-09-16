import React from 'react';
import CommonTemplate from '../components/common/CommTemplate';
import EditChargeForm from '../containers/sales/EditChargeForm';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EditChargePage = ({ history }) => {
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
      <CommonTemplate type="EditCharge">
        <EditChargeForm />
      </CommonTemplate>
    );
  } else return null;
};

export default withRouter(EditChargePage);
