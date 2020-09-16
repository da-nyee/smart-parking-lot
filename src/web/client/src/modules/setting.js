import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import { takeLatest } from 'redux-saga/effects';
import * as settingAPI from '../lib/api/setting';

const CHANGE_FIELD = 'setting/CHANGE_FIELD';
const INITIALIZE_FORM = 'setting/INITIALIZE_FORM';

const [
  EDIT_PERIOD,
  EDIT_PERIOD_SUCCESS,
  EDIT_PERIOD_FAILURE,
] = createRequestActionTypes('setting/EDIT_PERIOD');
const [
  GET_PERIOD,
  GET_PERIOD_SUCCESS,
  GET_PERIOD_FAILURE,
] = createRequestActionTypes('setting/GET_PERIOD');

export const changeField = createAction(
  CHANGE_FIELD,
  ({ form, key, value }) => ({
    form,
    key,
    value,
  })
);
export const initializeForm = createAction(INITIALIZE_FORM, (form) => form);
export const editPeriod = createAction(EDIT_PERIOD, ({ newPeriod }) => ({
  newPeriod,
}));
export const getPeriod = createAction(GET_PERIOD);

const getPeriodSaga = createRequestSaga(GET_PERIOD, settingAPI.getPeriod);
const editPeriodSaga = createRequestSaga(EDIT_PERIOD, settingAPI.editPeriod);

export function* settingSaga() {
  yield takeLatest(EDIT_PERIOD, editPeriodSaga);
  yield takeLatest(GET_PERIOD, getPeriodSaga);
}

const initialState = {
  period: {
    oldPeriod: '',
    newPeriod: '',
  },
  error: null,
};

const setting = handleActions(
  {
    [CHANGE_FIELD]: (state, { payload: { form, key, value } }) =>
      produce(state, (draft) => {
        draft[form][key] = value;
      }),
    [INITIALIZE_FORM]: (state, { payload: form }) => ({
      ...state,
      [form]: initialState[form],
    }),
    [GET_PERIOD_SUCCESS]: (state, { payload: period }) => ({
      ...state,
      period,
      error: null,
    }),
    [GET_PERIOD_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
    [EDIT_PERIOD_SUCCESS]: (state, { payload: period }) => ({
      ...state,
      period,
      error: null,
    }),
    [EDIT_PERIOD_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
  },
  initialState
);

export default setting;
