import { GET_ERRORS, CLEAR_ERRORS } from "../actions/types";

const initalState = {
  msg: null,
  status: null,
  id: null,
};

export default function errorReducer(state = initalState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        ...action.payload,
      };

    case CLEAR_ERRORS:
      return {
        msg: null,
        status: null,
        id: null,
      };

    default:
      return state;
  }
}
