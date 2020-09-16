import React from 'react';
import MUList from '@material-ui/core/List';
import ListItem from './ListItem';

const List = ({ menus, handleHover, handleLeave }) => {
  return (
    <MUList disablePadding={true}>
      {menus.map((menu, index) => (
        <ListItem
          menu={menu}
          handleHover={handleHover}
          handleLeave={handleLeave}
          key={menu.id}
        />
      ))}
    </MUList>
  );
};

export default List;
