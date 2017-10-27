import { createStore } from 'redux'

const initialState = {history: [], users: []} // If data is large, it's best to use an immutable-js data structure

const ADD_HISTORY = 'ADD_HISTORY',
      ADD_USER    = 'ADD_USER'

// Reducers
function history(state = initialState, action) {
  switch (action.type) {
    case ADD_HISTORY:
      return {
        ...state,
        history: state.history.concat(action.history),
      }
    default:
      return state
  }
}

// Actions
export function addHistory(history) {
  return {
    type: ADD_HISTORY,
    history
  }
}

// Store
export const store = createStore(history, initialState)
