import {configureStore, ThunkAction, Action, combineReducers} from "@reduxjs/toolkit";
import { authSlice } from "./authSlice";
import { userSlice } from "./userSlice";
import { templateSlice } from "./templateSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [templateSlice.name]: templateSlice.reducer,
})

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    persistedReducer
  },
  devTools: true,
});

export const persister = persistStore(store);