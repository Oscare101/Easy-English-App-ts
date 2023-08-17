import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './theme'
import authenticationReducer from './authentication'

export const store = configureStore({
  reducer: {
    themeFilter: themeReducer,
    authentication: authenticationReducer,
  },
})
