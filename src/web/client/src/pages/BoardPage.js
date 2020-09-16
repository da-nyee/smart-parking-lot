import React from 'react';
import CommonTemplate from '../components/common/CommTemplate';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BoardForm from '../containers/board/BoardForm';

const BoardPage = ({ history }) => {
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
      <CommonTemplate type="Board">
        <BoardForm />
      </CommonTemplate>
    );
  } else return null;
};

export default withRouter(BoardPage);
