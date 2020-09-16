import React from 'react';
import Header from '../common/Header';
import CssBaseline from '@material-ui/core/CssBaseline'; //css설정을 구분?
import { makeStyles } from '@material-ui/core/styles';
import SideMenuBar from './SideMenuBar';
import styled from 'styled-components';
import WhiteBox from './WhiteBox';

const CommonTemplateBlock = styled.div`
  /*화면 채움*/
  position: absolute;
  left: 15rem;
  top: 6rem;
  bottom: 0;
  right: 0;
  /*flex로 내용 중앙 정렬*/
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
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
  EditCharge: '요금 수정(원/시간)',
  EditPeriod: '측정 주기 변경(ms)',
  Register: '비밀번호 변경',
  Control: '제어판',
  Board: '상황판',
};

const CommonTemplate = ({ type, children }) => {
  const classes = useStyles();
  const text = textMap[type];

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header />
      <SideMenuBar />
      <CommonTemplateBlock>
        <div>
          {type !== 'Graph' && <LogoBox>{text}</LogoBox>}
          {type === 'Control' || type === 'Graph' ? (
            <>{children}</>
          ) : (
            <WhiteBox>{children}</WhiteBox>
          )}
        </div>
      </CommonTemplateBlock>
    </div>
  );
};

export default CommonTemplate;
