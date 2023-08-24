import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    authentication: 'auto', // auto password biometric
  },
  reducers: {
    setAuthentication(state, value: PayloadAction<string>) {
      state.authentication = value.payload
    },
  },
})

export const { setAuthentication } = authenticationSlice.actions
export default authenticationSlice.reducer
