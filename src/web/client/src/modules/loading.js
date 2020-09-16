import { createAction, handleActions } from 'redux-actions';

const START_LOADING = 'loading/START_LOADING';
const FINISH_LOADING = 'loading/FINISH_LOADING';

//6
export const startLoading = createAction(
  START_LOADING,
  (requestType) => requestType
);

//12
export const finishLoading = createAction(
  FINISH_LOADING,
  (requestType) => requestType
);

const initialState = {};

const loading = handleActions(
  {
    //7
    [START_LOADING]: (state, action) => ({
      ...state,
      [action.payload]: true,
    }),
    //13
    [FINISH_LOADING]: (state, action) => ({
      ...state,
      [action.payload]: false,
    }),
  },
  initialState
);

export default loading;
