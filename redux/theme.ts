import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: 'system', // system dark light
  },
  reducers: {
    setTheme(state, value: PayloadAction<string>) {
      // action: PayloadAction<string>
      state.theme = value.payload
    },
  },
})

export const { setTheme } = themeSlice.actions
export default themeSlice.reducer
