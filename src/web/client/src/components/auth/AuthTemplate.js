import React from 'react';
import Header from '../common/Header';
import CssBaseline from '@material-ui/core/CssBaseline'; //css설정을 구분?
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import WhiteBox from '../common/WhiteBox';

const AuthTemplateBlock = styled.div`
  /*화면 채움*/
  position: absolute;
  left: 0;
  top: 6rem;
  bottom: 0;
  right: 0;
  /*flex로 내용 중앙 정렬*/
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LogoBox = styled.div`
  padding: 0.5rem;
  font-size: 3rem;
  width: 50rem;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
}));

const textMap = {
  login: '관리자 로그인',
};

const AuthTemplate = ({ type, children }) => {
  const classes = useStyles();
  const text = textMap[type];

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header />
      <AuthTemplateBlock>
        {type !== undefined ? (
          <>
            <LogoBox>{text}</LogoBox>
            <WhiteBox>{children}</WhiteBox>
          </>
        ) : (
          <WhiteBox flex>{children}</WhiteBox>
        )}
      </AuthTemplateBlock>
    </div>
  );
};

export default AuthTemplate;
