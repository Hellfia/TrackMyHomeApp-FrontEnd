import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { token: null, email: null },
};

export const constructorSlice = createSlice({
  name: "constructor",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
    },
  },
});

export const { login, logout } = constructorSlice.actions;
export default constructorSlice.reducer;
