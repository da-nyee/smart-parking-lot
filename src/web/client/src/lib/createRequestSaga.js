import { call, put } from 'redux-saga/effects';
import { startLoading, finishLoading } from '../modules/loading';

export const createRequestActionTypes = (type) => {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return [type, SUCCESS, FAILURE];
};

export default function createRequestSaga(type, request) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return function* (action) {
    yield put(startLoading(type)); //5

    try {
      const response = yield call(request, action.payload); //8
      //console.log('try request', request);
      //console.log('try payload', action.payload);
      //console.log('try response', response);

      //9
      yield put({
        type: SUCCESS,
        payload: response.data,
        meta: response,
      });
    } catch (e) {
      //console.log('catch request', request);
      //console.log('catch payload', action.payload);

      yield put({
        type: FAILURE,
        payload: e,
        error: true,
      });
    }

    yield put(finishLoading(type)); //11
  };
}
