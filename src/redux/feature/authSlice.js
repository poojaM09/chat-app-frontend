import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postdata } from "../../Utils/http.class";
import jwtDecode from "jwt-decode";
import { socket } from "../../socket";
import { useEffect } from "react";
import { successToast } from "../../Components/Toast";

let token = localStorage.getItem("user") ? localStorage.getItem("user") : null
let user = null;


if (token) {
  user = jwtDecode(token);
  console.log(user,'useruseruser')
}
let initialState = {
  user: {
    id: user?.id ? user.id : null,
    email: user?.email ? user.email : null,
    password: user?.password ? user.password : null,
    name:user?.name ? user.name : null,
  },
  isLoggin: user ? true : false,
  errorMsg: null,
};

export const loginUser = createAsyncThunk("user/login", async (data) => {
  const res = await postdata("user/login", data);
  const response = await res.json();
  return response;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state, action) => {
      localStorage.clear();
      state.isLoggin = false;
    },
  },
  extraReducers: {
    [loginUser.pending]: (state, action) => {
      state.isLoggin = false;
      state.errorMsg = null;
    },
    [loginUser.fulfilled]: (state, action) => {
      if (action.payload.status == 1) {

        localStorage.setItem("user", action.payload.token);
        const data = jwtDecode(action.payload.token);
        socket.emit("login", data.id);
        state.user.id = data.id;
        state.user.email = data.email;
        state.user.password = data.password;
        state.errorMsg = null;
        state.isLoggin = true;
      } else {
        state.errorMsg = action.payload.message;
      }
    },
    [loginUser.rejected]: (state, action) => {
      state.isLoggin = false;
      state.errorMsg = "something wrong";
    },
  },
});

export default authSlice.reducer;
export const { logoutUser } = authSlice.actions;