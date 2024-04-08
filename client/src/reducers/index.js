import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import configReducer from "./configReducer";
import priceReducer from "./priceReducer";
import transactionReducer from "./transactionReducer";

export default combineReducers({
  auth: authReducer,
  error: errorReducer,
  config: configReducer,
  price: priceReducer,
  transaction: transactionReducer,
});
