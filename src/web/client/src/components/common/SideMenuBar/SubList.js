import React from 'react';
import MUList from '@material-ui/core/List';
import ListItem from './ListItem';

const SubList = ({ subs }) => {
  return (
    <MUList>
      {subs.map((sub, index) => (
        <ListItem menu={sub} />
      ))}
    </MUList>
  );
};

export default SubList;
