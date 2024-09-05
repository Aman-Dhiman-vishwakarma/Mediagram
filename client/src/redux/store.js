import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./authSlice";
import postSlice from "./postSlice";
import userSlice from "./userSlice";
import commentSlice from "./commentSlice";
import messageSlice from "./messageSlice";
import socketSlice from "./socketSlice";
import chatSlice from "./chatSlice";
import notificationSlice from "./notificationSlice";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  post: postSlice.reducer,
  user: userSlice.reducer,
  comment:commentSlice.reducer,
  message:messageSlice.reducer,
  socket:socketSlice.reducer,
  chat:chatSlice.reducer,
  notification:notificationSlice.reducer
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
export const persistor = persistStore(store);
