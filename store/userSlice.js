import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

// Initial state
const initialState = {
  uid: 0,
  email: "",
  userName: "",
  role: "",
  phone: 0,
  name: "",
  bloodType: ""
};

// Actual Slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to set the UID
    setUid(state, action) {
      console.log("trying to set new uid");
      state.uid = action.payload;
    },

    // Action to set the email
    setEmail(state, action) {
      state.email = action.payload;
    },

    // Action to set the username
    setUserName(state, action) {
      console.log("trying to set new username");
      state.userName = action.payload;
    },

    // Action to set the username
    setRole(state, action) {
      state.role = action.payload;
    },

    // Action to set the whole user object.
    setCurrentUser(state, action) {
      Object.assign(state, action.payload);
    },

    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    extraReducers: {
      [HYDRATE]: (state, action) => {
        return {
          ...state,
          ...action.payload.auth,
        };
      },
    },
  },
});

export const { setUid, setEmail, setUserName, setRole, setCurrentUser } = userSlice.actions;

export const selectUserUID = (state) => state.persistedReducer.user.uid;
export const selectUserEmail = (state) => state.persistedReducer.user.email;
export const selectUserUsername = (state) => state.persistedReducer.user.userName;
export const selectUserRole = (state) => state.persistedReducer.user.role;
export const selectCurrentUser = (state) => state.persistedReducer.user;

export default userSlice.reducer;