import { createAction, handleActions } from 'redux-actions';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import { takeLatest } from 'redux-saga/effects';
import * as graphAPI from '../lib/api/graph';

const [
  GET_SALES,
  GET_SALES_SUCCESS,
  GET_SALES_FAILURE,
] = createRequestActionTypes('graph/GET_SALES');
const [
  GET_USAGE,
  GET_USAGE_SUCCESS,
  GET_USAGE_FAILURE,
] = createRequestActionTypes('graph/GET_USAGE');

export const getSales = createAction(GET_SALES, ({ from, to }) => ({
  from,
  to,
}));
export const getUsage = createAction(GET_USAGE, ({ date }) => ({ date }));

const getSalesSaga = createRequestSaga(GET_SALES, graphAPI.getSales);
const getUsageSaga = createRequestSaga(GET_USAGE, graphAPI.getUsage);

export function* graphSaga() {
  yield takeLatest(GET_SALES, getSalesSaga);
  yield takeLatest(GET_USAGE, getUsageSaga);
}

const weekAgo = () => {
  let today = new Date();
  today.setDate(today.getDate() - 7);

  return today;
};

const initialState = {
  from: weekAgo(),
  to: new Date(),
  date: new Date(),
  salesData: [],
  usageData: [],
  error: null,
};

const graph = handleActions(
  {
    [GET_SALES]: (state, { payload: date }) => ({
      ...state,
      from: date.from,
      to: date.to,
    }),
    [GET_SALES_SUCCESS]: (state, { payload: salesData }) => ({
      ...state,
      salesData,
      error: null,
    }),
    [GET_SALES_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
    [GET_USAGE]: (state, { payload: date }) => ({
      ...state,
      date: date.date,
    }),
    [GET_USAGE_SUCCESS]: (state, { payload: usageData }) => ({
      ...state,
      usageData,
      error: null,
    }),
    [GET_USAGE_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
  },
  initialState
);

export default graph;
