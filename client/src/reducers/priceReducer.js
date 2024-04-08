import { GET_PRICE } from "../actions/types";

const initalState = {
  prices: {},
};

export default function errorReducer(state = initalState, action) {
  switch (action.type) {
    case GET_PRICE:
      return {
        prices: action.payload,
      };

    default:
      return state;
  }
}
