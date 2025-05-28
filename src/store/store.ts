import { configureStore } from "@reduxjs/toolkit";
import complaintsSlice from "./slice/complaints.slice";
import userReducer from "./slice/user.slice";
import uiSlice from "./slice/ui.slice";

export const store = configureStore({
    reducer: {
        complaint: complaintsSlice.reducer,
        user: userReducer,
        ui:  uiSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;