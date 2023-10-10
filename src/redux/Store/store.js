import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../feature/authSlice";
import clientSlice from "../feature/clientSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    client: clientSlice,
  },
});

export default store;
