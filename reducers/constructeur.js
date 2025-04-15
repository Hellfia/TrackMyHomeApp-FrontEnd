import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    role: null,
    projectId: null,
    constructorName: null,
  },
};

export const constructeurSlice = createSlice({
  initialState,
  name: "constructeur",
  reducers: {
    loginConstructeur: (state, action) => {
      state.value.constructorId = action.payload.constructorId;
      state.value.token = action.payload.token;
      state.value.role = action.payload.role;
      state.value.constructorName = action.payload.constructorName;
    },
    logout: (state) => {
      state.value.constructorId = null;
      state.value.token = null;
      state.value.role = null;
      state.value.projectId = null;
    },
    addDocument: (state, action) => {
      state.value.projectId = action.payload;
    },
  },
});

export const { loginConstructeur, logout, addDocument } =
  constructeurSlice.actions;
export default constructeurSlice.reducer;
