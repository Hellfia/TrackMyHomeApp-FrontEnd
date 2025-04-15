import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    projectId: null,
    role: null,
    clientId: null,
    firstname: null,
    lastname: null,
  },
};

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    loginClient: (state, action) => {
      state.value.clientId = action.payload.clientId;
      state.value.token = action.payload.token;
      state.value.role = action.payload.role;
      state.value.projectId = action.payload.projectId;
      state.value.firstname = action.payload.firstname;
      state.value.lastname = action.payload.lastname;
    },
    logout: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { loginClient, logout } = clientSlice.actions;
export default clientSlice.reducer;
