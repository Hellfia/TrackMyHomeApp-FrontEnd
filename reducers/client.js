import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { token: null, email: null, role: null },
};

export const clientSlice = createSlice({
  initialState,
  name: "client",
  reducers: {
    loginClient: (state, action) => {
      state.value.clientId = action.payload.clientId;
      state.value.token = action.payload.token;
      state.value.role = action.payload.role;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
    },
  },
});

export const { loginClient, logout, updateProfile } = clientSlice.actions;
export default clientSlice.reducer;
