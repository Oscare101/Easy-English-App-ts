import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const technicalPauseSlice = createSlice({
  name: 'technicalPause',
  initialState: {
    technicalPause: false,
  },
  reducers: {
    setTechnicalPause(state, value: PayloadAction<boolean>) {
      state.technicalPause = value.payload
    },
  },
})

export const { setTechnicalPause } = technicalPauseSlice.actions
export default technicalPauseSlice.reducer
