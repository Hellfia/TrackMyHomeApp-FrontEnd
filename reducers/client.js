import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { token: null, projectId: null, role: null },
};

export const clientSlice = createSlice({
  initialState,
  name: "client",
  reducers: {
    loginClient: (state, action) => {
      state.value.clientId = action.payload.clientId;
      state.value.token = action.payload.token;
      state.value.role = action.payload.role;
      state.value.projectId = action.payload.projectId;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.clientId = null;
      state.value.role = null;
      state.value.projectId = null;
    },
  },
});

export const { loginClient, logout, updateProfile } = clientSlice.actions;
export default clientSlice.reducer;
