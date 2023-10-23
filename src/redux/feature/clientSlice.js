import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postdata } from "../../Utils/http.class";
import jwtDecode from "jwt-decode";
import { socket } from "../../socket";

let token = localStorage.getItem("user") ? localStorage.getItem("user") : null;
let user = null;


if (token) {
  user = jwtDecode(token);
  console.log(user,'dwdsadsad')
} else {
  user = null
}


let initialState = {
  user: {
    id: user?.id ? user.id : null,
    email: user?.email ? user.email : null,
    contactNumber: user?.contactNumber ? user.contactNumber : null,
    name: user?.name ? user?.name : null,
  },
  isLoggin: user ? true : false,
  errorMsg: null,
};  

export const loginUser = createAsyncThunk("user/addclient", async (data) => {
  const res = await postdata("user/addclient", data);
  const response = await res.json();
  console.log(response,'response')
  localStorage.setItem('client', JSON.stringify(response?.user))
  console.log(response?.user, 'respon24343243se')
  return response;
});

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    logoutClient: (state, action) => {
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
        socket.emit("client-login", data.id);
        state.user.id = data.id;
        state.user.email = data.email;
        state.user.contactNumber = data.contactNumber;
        state.user.name = data.name;
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

export default clientSlice.reducer;
export const { logoutClient } = clientSlice?.actions;
