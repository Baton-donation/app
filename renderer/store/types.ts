import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { SentencesState } from "./sentences/types";

export interface RootState {
  sentences: SentencesState;
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;
export type AppThunkDispatch = ThunkDispatch<RootState, unknown, Action>;
