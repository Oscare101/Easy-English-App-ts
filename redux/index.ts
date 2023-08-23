import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './theme'
import authenticationReducer from './authentication'
import themeColorReducer from './themeColor'
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    themeColor: themeColorReducer,
    authentication: authenticationReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
