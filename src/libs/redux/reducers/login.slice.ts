import type { ActionInterface } from '../store';
import { createSlice } from '@reduxjs/toolkit';

interface DefaulState {
  isReady: boolean;
  isLogin: boolean;
  loginRole: string;
  loginWait: boolean;
  loginBgUrl: string;
}

const DefaultLoginState: DefaulState = {
  isReady: false,
  isLogin: false,
  loginRole: '',
  loginWait: false,
  loginBgUrl: '',
};

function SetLoginReady(state: DefaulState, action: ActionInterface) {
  state.isReady = action.payload;
}

function Login(state: DefaulState, action: ActionInterface) {
  state.isLogin = true;
  state.loginRole = action.payload;
}

function Logout(state: DefaulState) {
  state.isLogin = false;
  state.loginRole = '';

  // Dont for get to remove deep URL first
  window.history.pushState({}, '', '/');
}

function WaitLogin(state: DefaulState) {
  state.loginWait = true;
}

function FinishWaitLogin(state: DefaulState) {
  state.loginWait = false;
}

function UpdateBgUrl(state: DefaulState, action: ActionInterface) {
  state.loginBgUrl = action.payload;
}

const LoginSlice = createSlice({
  name: 'login',
  initialState: DefaultLoginState,
  reducers: {
    login: Login,
    logout: Logout,
    waitLogin: WaitLogin,
    finishWaitLogin: FinishWaitLogin,
    setLoginReady: SetLoginReady,

    updateBgUrl: UpdateBgUrl,
  },
});

export const {
  login,
  logout,
  waitLogin,
  finishWaitLogin,
  setLoginReady,
  updateBgUrl,
} = LoginSlice.actions;
export default LoginSlice.reducer;
