import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducers";

export default function configureStore() {
  return createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
}
