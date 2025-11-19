import type { ActionInterface } from '../../store';
import { createSlice } from '@reduxjs/toolkit';

interface DefaultUserOnlineList {
  opened: boolean;
  isLoading: boolean;
  data: any[];
}

interface OnlineOfflineOptions {
  active: boolean;
  tlp: string;
}

const DefaultUserOnlineListState: DefaultUserOnlineList = {
  opened: false,
  isLoading: true,
  data: [],
};

function SetData(state: DefaultUserOnlineList, action: ActionInterface) {
  state.data = action.payload;
}

function OnlineOffline(
  state: DefaultUserOnlineList,
  options: OnlineOfflineOptions,
) {
  const matched = state.data.find((d) => d.tlp == options.tlp);
  if (matched) {
    let new_data = [];
    for (let d of state.data) {
      let nd = { ...d };
      if (options.tlp == d.tlp) {
        nd.online = options.active;
      }
      new_data.push(nd);
    }
    state.data = new_data;
  }
}

function SetOnline(state: DefaultUserOnlineList, action: ActionInterface) {
  OnlineOffline(state, { active: true, tlp: action.payload });
}

function SetOffline(state: DefaultUserOnlineList, action: ActionInterface) {
  OnlineOffline(state, { active: false, tlp: action.payload });
}

function Open(state: DefaultUserOnlineList) {
  state.opened = true;
}

function Close(state: DefaultUserOnlineList) {
  state.opened = false;
}

function SetLoading(state: DefaultUserOnlineList, action: ActionInterface) {
  state.isLoading = action.payload;
}

const AlertSlice = createSlice({
  name: 'user.online-list',
  initialState: DefaultUserOnlineListState,
  reducers: {
    openUserOnline: Open,
    closeUserOnline: Close,
    setUserOnlineData: SetData,
    setUserOnline: SetOnline,
    setUserOffline: SetOffline,
    setUserOnlineLoading: SetLoading,
  },
});

export const {
  setUserOnlineData,
  setUserOnline,
  setUserOffline,
  openUserOnline,
  closeUserOnline,
  setUserOnlineLoading,
} = AlertSlice.actions;
export default AlertSlice.reducer;
