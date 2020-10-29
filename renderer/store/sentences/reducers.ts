import { SET_SENTENCES, SentencesState, SentencesActionTypes } from "./types";

const initialState: SentencesState = {
  sentences: [],
};

const reducer = (
  state = initialState,
  action: SentencesActionTypes
): SentencesState => {
  switch (action.type) {
    case SET_SENTENCES: {
      return {
        ...state,
        sentences: action.sentences,
      };
    }
    default:
      return state;
  }
};

export default reducer;
