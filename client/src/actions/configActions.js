import { SET_VISIBLE } from "./types";

export const setVisible = (isVisible) => {
  return {
    type: SET_VISIBLE,
    payload: isVisible,
  };
};
