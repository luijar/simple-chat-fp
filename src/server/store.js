import { createStore } from 'redux'

const initialState = {history: [], users: []} // If data is large, it's best to use an immutable-js data structure

const ADD_HISTORY = 'ADD_HISTORY',
      ADD_USER    = 'ADD_USER'

// Reducers
const history = (state=initialState, action) => {
    return action.type === ADD_HISTORY
                 ? { ...state, history: state.history.concat(action.history), }
                 : state;
};

// Actions
export function addHistory(history) {
  return {
    type: ADD_HISTORY,
    history
  }
}

// Store
export const store = createStore(history, initialState)
