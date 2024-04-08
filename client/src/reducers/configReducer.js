import { SET_VISIBLE } from "../actions/types";

const initalState = {
  isVisible: true,
};

export default function errorReducer(state = initalState, action) {
  switch (action.type) {
    case SET_VISIBLE:
      return {
        isVisible: action.payload,
      };

    default:
      return state;
  }
}
