import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import { takeLatest } from 'redux-saga/effects';
import * as salesAPI from '../lib/api/sales';

const CHANGE_FIELD = 'sales/CHANGE_FIELD';
const INITIALIZE_FORM = 'sales/INITIALIZE_FORM';

const [
  EDIT_CHARGE,
  EDIT_CHARGE_SUCCESS,
  EDIT_CHARGE_FAILURE,
] = createRequestActionTypes('sales/EDIT_CHARGE');
const [
  GET_CHARGE,
  GET_CHARGE_SUCCESS,
  GET_CHARGE_FAILURE,
] = createRequestActionTypes('sales/GET_CHARGE');

export const changeField = createAction(
  CHANGE_FIELD,
  ({ form, key, value }) => ({
    form,
    key,
    value,
  })
);
export const initializeForm = createAction(INITIALIZE_FORM, (form) => form);
export const editCharge = createAction(EDIT_CHARGE, ({ newCharge }) => ({
  newCharge,
}));
export const getCharge = createAction(GET_CHARGE);

const getChargeSaga = createRequestSaga(GET_CHARGE, salesAPI.getCharge);
const editChargeSaga = createRequestSaga(EDIT_CHARGE, salesAPI.editCharge);

export function* salesSaga() {
  yield takeLatest(EDIT_CHARGE, editChargeSaga);
  yield takeLatest(GET_CHARGE, getChargeSaga);
}

const initialState = {
  charge: {
    oldCharge: '',
    newCharge: '',
  },
  error: null,
};

const sales = handleActions(
  {
    [CHANGE_FIELD]: (state, { payload: { form, key, value } }) =>
      produce(state, (draft) => {
        draft[form][key] = value;
      }),
    [INITIALIZE_FORM]: (state, { payload: form }) => ({
      ...state,
      [form]: initialState[form],
    }),
    [GET_CHARGE_SUCCESS]: (state, { payload: charge }) => ({
      ...state,
      charge,
      error: null,
    }),
    [GET_CHARGE_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
    [EDIT_CHARGE_SUCCESS]: (state, { payload: charge }) => ({
      ...state,
      charge,
      error: null,
    }),
    [EDIT_CHARGE_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
  },
  initialState
);

export default sales;
