import React, {useCallback} from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import palette from '../../lib/styles/palette';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { logout } from '../../modules/user';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    height: '6rem',
    justifyContent: 'center',
    background: `${palette.cyan[6]}`,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
}));

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
    align-items:flex-end;
`;

const StyledA=styled.a`
    margin-right:1rem;
    position:relative;
    top:0.7rem;
    cursor:pointer;
    text-decoration:underline;
`;

const Header = () => {
  const classes = useStyles();
    const dispatch=useDispatch();
    const onLogout=useCallback(()=>{
        dispatch(logout());
    }, [dispatch]);
    const {user}=useSelector(({user})=>({user:user.user}));

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
      <FlexBox>
      <Toolbar>
          <Typography variant="h3" noWrap>
            <Link to="/" className={classes.link}>
              코오롱 주차장
            </Link>
          </Typography>
        </Toolbar>
      {user&&<StyledA onClick={()=>onLogout()}>로그아웃</StyledA>}
      </FlexBox>
      </AppBar>
    </>
  );
};

export default Header;
