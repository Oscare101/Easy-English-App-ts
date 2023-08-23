import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './theme'
import authenticationReducer from './authentications'
import themeColorReducer from './themeColor'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    themeColor: themeColorReducer,
    authentication: authenticationReducer,
  },
})
