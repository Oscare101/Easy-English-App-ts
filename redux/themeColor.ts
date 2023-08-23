import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const themeColorSlice = createSlice({
  name: 'themeColor',
  initialState: {
    themeColor: 'dark', // dark light
  },
  reducers: {
    setThemeColor(state, value: PayloadAction<string>) {
      // action: PayloadAction<string>
      state.themeColor = value.payload
    },
  },
})

export const { setThemeColor } = themeColorSlice.actions
export default themeColorSlice.reducer
