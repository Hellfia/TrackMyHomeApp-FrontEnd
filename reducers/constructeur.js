import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { token: null, email: null },
};

export const constructeurSlice = createSlice({
  initialState,
  name: "constructeur",
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
    },
    updateProfile: (state, action) => {
      state.value.constructorName = action.payload.constructorName;
      state.value.constructorSiret = action.payload.constructorSiret;
      state.value.email = action.payload.email;
      state.value.password = action.payload.password;
    },
  },
});

export const { login, logout, updateProfile } = constructeurSlice.actions;
export default constructeurSlice.reducer;
