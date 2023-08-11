import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const themeSlice = createSlice({
  name: 'themeFilter',
  initialState: {
    themeFilter: 'system', // system dark light
  },
  reducers: {
    setThemeFilter(state, value: PayloadAction<string>) {
      // action: PayloadAction<string>
      state.themeFilter = value.payload
    },
  },
})

export const { setThemeFilter } = themeSlice.actions
export default themeSlice.reducer
