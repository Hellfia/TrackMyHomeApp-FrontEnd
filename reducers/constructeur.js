import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    email: null,
    constructorName: null,
    constructorSiret: null,
    password: null,
    documents: [],
  },
};

export const constructeurSlice = createSlice({
  initialState,
  name: "constructeur",
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
      state.value.role = action.payload.role;
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
    addDocument: (state, action) => {
      state.value.documents = action.payload;
      console.log("payload", action.payload);
    },
    deleteDocument: (state, action) => {
      state.value.documents = state.value.documents.filter(
        (doc) => doc.id !== action.payload
      );
    },
  },
});

export const { login, logout, updateProfile, addDocument, deleteDocument } =
  constructeurSlice.actions;
export default constructeurSlice.reducer;
