// SearchHistoryContext.tsx

import React, { createContext, useContext, useReducer } from 'react'

interface SearchHistoryState {
  history: string[]
}

const initialState: SearchHistoryState = {
  history: [],
}

type Action = { type: 'ADD_TO_HISTORY'; payload: string }

const searchHistoryReducer = (state: SearchHistoryState, action: Action): SearchHistoryState => {
  switch (action.type) {
    case 'ADD_TO_HISTORY':
      return { ...state, history: [...state.history, action.payload] }
    default:
      return state
  }
}

const SearchHistoryContext = createContext<{
  state: SearchHistoryState
  dispatch: React.Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => null,
})

export const SearchHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(searchHistoryReducer, initialState)
  return <SearchHistoryContext.Provider value={{ state, dispatch }}>{children}</SearchHistoryContext.Provider>
}

export const useSearchHistory = () => useContext(SearchHistoryContext)
