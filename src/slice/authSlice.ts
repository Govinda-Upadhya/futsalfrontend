import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  email: string;
  otpAvail: boolean;
}

const initialState: AuthState = {
  email: "",
  otpAvail: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    clearEmail: (state) => {
      state.email = "";
    },
    setOtpAvail: (state, action: PayloadAction<boolean>) => {
      state.otpAvail = action.payload;
    },
    clearOtpAvail: (state) => {
      state.otpAvail = false;
    },
  },
});

export const { setEmail, clearEmail, setOtpAvail, clearOtpAvail } =
  authSlice.actions;
export default authSlice.reducer;
