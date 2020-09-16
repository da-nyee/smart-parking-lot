import { combineReducers } from 'redux';
import auth, { authSaga } from './auth';
import { all } from 'redux-saga/effects';
import sales, { salesSaga } from './sales';
import setting, { settingSaga } from './setting';
import loading from './loading';
import user, { userSaga } from './user';
import control, { controlSaga } from './control';
import graph, { graphSaga } from './graph';
import board, { boardSaga } from './board';

const rootReducer = combineReducers({
  auth,
  sales,
  setting,
  loading,
  user,
  control,
  graph,
  board,
});

export function* rootSaga() {
  yield all([
    authSaga(),
    userSaga(),
    salesSaga(),
    settingSaga(),
    controlSaga(),
    graphSaga(),
    boardSaga(),
  ]);
}

export default rootReducer;
