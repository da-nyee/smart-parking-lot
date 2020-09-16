import React from 'react';
import { Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EditChargePage from './pages/EditChargePage';
import EditPeriodPage from './pages/EditPeriodPage';
import RegisterPage from './pages/RegisterPage';
import LoginRequirePage from './pages/LoginRequire';
import AlreadyLoginPage from './pages/AlreadyLogin';
import ControlPage from './pages/ControlPage';
import GraphPage from './pages/GraphPage';
import BoardPage from './pages/BoardPage';

const App = () => {
  return (
    <>
      <Route component={LoginPage} path="/login" />
      <Route component={EditChargePage} path="/editCharge" />
      <Route component={EditPeriodPage} path="/editPeriod" />
      <Route component={RegisterPage} path="/register" />
      <Route component={LoginRequirePage} path="/loginRequire" />
      <Route component={AlreadyLoginPage} path="/alreadyLogin" />
      <Route component={ControlPage} path="/control" />
      <Route component={GraphPage} path="/graph" />
      <Route component={BoardPage} path="/board" />
    </>
  );
};

export default App;
