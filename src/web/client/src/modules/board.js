import { createAction, handleActions } from 'redux-actions';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import { takeLatest } from 'redux-saga/effects';
import * as boardAPI from '../lib/api/board';

const [
  GET_PARKING,
  GET_PARKING_SUCCESS,
  GET_PARKING_FAILURE,
] = createRequestActionTypes('board/GET_PARKING');

export const getParking = createAction(GET_PARKING);

const getParkingSaga = createRequestSaga(GET_PARKING, boardAPI.getParking);

export function* boardSaga() {
  yield takeLatest(GET_PARKING, getParkingSaga);
}

const initialState = {
  parking: [],
  error: null,
};

const board = handleActions(
  {
    [GET_PARKING_SUCCESS]: (state, { payload: parking }) => ({
      ...state,
      parking,
      error: null,
    }),
    [GET_PARKING_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
  },
  initialState
);

export default board;
