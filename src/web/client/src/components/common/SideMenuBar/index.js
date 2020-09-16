import React, { useState, useCallback } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from './List';
import { makeStyles } from '@material-ui/core/styles';
import palette from '../../../lib/styles/palette';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    background: `${palette.gray[5]}`,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  toolBar: {
    height: '6rem',
  },
}));

const SideMenuBar = () => {
  const classes = useStyles();

  const [menus, setMenus] = useState([
    {
      id: '매출관리',
      link: '/graph',
      subs: [
        {
          sub: true,
          id: '기간별 조회',
          link: '/graph',
        },
        {
          sub: true,
          id: '요금 수정',
          link: '/editCharge',
        },
      ],
      open: false,
    },
    {
      id: '제어판',
      link: '/control',
    },
    {
      id: '상황판',
      link: '/board',
    },
    {
      id: '환경설정',
      link: '/register',
      subs: [
        {
          sub: true,
          id: '비밀번호 변경',
          link: '/register',
        },
        {
          sub: true,
          id: '측정주기 변경',
          link: '/editPeriod',
        },
      ],
      open: false,
    },
  ]);

  const handleHover = useCallback(
    (id) => {
      setMenus(
        menus.map((menu) => (menu.id === id ? { ...menu, open: true } : menu))
      );
    },
    [menus]
  );
  const handleLeave = useCallback(
    (id) => {
      setMenus(
        menus.map((menu) => (menu.id === id ? { ...menu, open: false } : menu))
      );
    },
    [menus]
  );

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar className={classes.toolBar} />
      <div className={classes.drawerContainer}>
        <List
          menus={menus}
          handleHover={handleHover}
          handleLeave={handleLeave}
        />
      </div>
    </Drawer>
  );
};

export default SideMenuBar;
