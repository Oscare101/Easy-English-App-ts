import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './theme'
import authenticationReducer from './authentication'
import themeColorReducer from './themeColor'
import technicalPauseReducer from './technicalPause'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    themeColor: themeColorReducer,
    authentication: authenticationReducer,
    technicalPause: technicalPauseReducer,
  },
})
