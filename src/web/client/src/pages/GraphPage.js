import React from 'react';
import CommonTemplate from '../components/common/CommTemplate';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import GraphForm from '../containers/graph/GraphForm';
import styled from 'styled-components';

const Position = styled.div`
  position: relative;
  top: 27rem;
`;

const GraphPage = ({ history }) => {
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
      <CommonTemplate type="Graph">
        <Position>
          <GraphForm />
        </Position>
      </CommonTemplate>
    );
  } else return null;
};

export default withRouter(GraphPage);
