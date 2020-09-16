import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import { takeLatest, put } from 'redux-saga/effects';
import * as controlAPI from '../lib/api/control';

const CHANGE_BUTTON = 'control/CHANGE_BUTTON';

const [
  INITIALIZE_STATUS,
  INITIALIZE_STATUS_SUCCESS,
  INITIALIZE_STATUS_FAILURE,
] = createRequestActionTypes('control/INITIALIZE_STATUS');
const [
  CHANGE_STATUS,
  CHANGE_STATUS_SUCCESS,
  CHANGE_STATUS_FAILURE,
] = createRequestActionTypes('control/CHANGE_STATUS');
const [
  GET_STATUS,
  GET_STATUS_SUCCESS,
  GET_STATUS_FAILURE,
] = createRequestActionTypes('control/GET_STATUS');

export const changeButton = createAction(
  CHANGE_BUTTON,
  ({ form, index, key, value, name }) => ({
    form,
    index,
    key,
    value,
    name,
  })
);
export const initializeStatus = createAction(INITIALIZE_STATUS);
export const changeStatus = createAction(CHANGE_STATUS, ({ name, status }) => ({
  name,
  status,
}));
export const getStatus = createAction(GET_STATUS);

function* changeButtonSaga(action) {
  yield put(
    changeStatus({
      name: action.payload.name,
      status: action.payload.value,
    })
  );
}
const getStatusSaga = createRequestSaga(GET_STATUS, controlAPI.getStatus);
const changeStatusSaga = createRequestSaga(
  CHANGE_STATUS,
  controlAPI.changeStatus
);
const initializeStatusSaga = createRequestSaga(
  INITIALIZE_STATUS,
  controlAPI.initializeStatus
);

export function* controlSaga() {
  yield takeLatest(CHANGE_BUTTON, changeButtonSaga);
  yield takeLatest(CHANGE_STATUS, changeStatusSaga);
  yield takeLatest(GET_STATUS, getStatusSaga);
  yield takeLatest(INITIALIZE_STATUS, initializeStatusSaga);
}

const initialState = {
  control: [
    {
      name: 'accel',
      status: false,
    },
    {
      name: 'elev',
      status: false,
    },
    {
      name: 'parking',
      status: false,
    },
    {
      name: 'double_parking',
      status: false,
    },
    {
      name: 'maxCar',
      status: false,
    },
    {
      name: 'parkInOut',
      status: false,
    },
  ],
  error: null,
};

const control = handleActions(
  {
    [CHANGE_BUTTON]: (state, { payload: { form, index, key, value } }) =>
      produce(state, (draft) => {
        draft[form][index][key] = value;
      }),
    [INITIALIZE_STATUS]: (state) => ({
      ...state,
      control: initialState['control'],
    }),
    [INITIALIZE_STATUS_SUCCESS]: (state, { payload: control }) => ({
      ...state,
      control,
      error: null,
    }),
    [INITIALIZE_STATUS_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
    [GET_STATUS_SUCCESS]: (state, { payload: control }) => ({
      ...state,
      control,
      error: null,
    }),
    [GET_STATUS_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
    [CHANGE_STATUS_SUCCESS]: (state, { payload: control }) => ({
      ...state,
      control,
      error: null,
    }),
    [CHANGE_STATUS_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
  },
  initialState
);

export default control;
