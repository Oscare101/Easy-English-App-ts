import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './theme'

export const store = configureStore({
  reducer: {
    themeFilter: themeReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
