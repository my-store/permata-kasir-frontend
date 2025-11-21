import type { ActionInterface } from "../../store";
import { createSlice } from "@reduxjs/toolkit";

interface DefaultAdminOnlineList {
  opened: boolean;
  isLoading: boolean;
  data: any[];
}

interface OnlineOfflineOptions {
  active: boolean;
  tlp: string;
}

const DefaultAdminOnlineListState: DefaultAdminOnlineList = {
  opened: false,
  isLoading: true,
  data: [],
};

function SetData(state: DefaultAdminOnlineList, action: ActionInterface) {
  state.data = action.payload;
}

function OnlineOffline(
  state: DefaultAdminOnlineList,
  options: OnlineOfflineOptions
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

function SetOnline(state: DefaultAdminOnlineList, action: ActionInterface) {
  OnlineOffline(state, { active: true, tlp: action.payload });
}

function SetOffline(state: DefaultAdminOnlineList, action: ActionInterface) {
  OnlineOffline(state, { active: false, tlp: action.payload });
}

function Open(state: DefaultAdminOnlineList) {
  state.opened = true;
}

function Close(state: DefaultAdminOnlineList) {
  state.opened = false;
}

function SetLoading(state: DefaultAdminOnlineList, action: ActionInterface) {
  state.isLoading = action.payload;
}

const AlertSlice = createSlice({
  name: "admin.online-list",
  initialState: DefaultAdminOnlineListState,
  reducers: {
    openAdminOnline: Open,
    closeAdminOnline: Close,
    setAdminOnlineData: SetData,
    setAdminOnline: SetOnline,
    setAdminOffline: SetOffline,
    setAdminOnlineLoading: SetLoading,
  },
});

export const {
  setAdminOnlineData,
  setAdminOnline,
  setAdminOffline,
  openAdminOnline,
  closeAdminOnline,
  setAdminOnlineLoading,
} = AlertSlice.actions;
export default AlertSlice.reducer;
