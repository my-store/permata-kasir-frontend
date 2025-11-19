import type { ActionInterface } from '../../store';
import { createSlice } from '@reduxjs/toolkit';

interface DefaultStateInterface {
  data: any[];
  updateDataWait: boolean;
}

const DefaultState: DefaultStateInterface = {
  data: [],
  updateDataWait: false,
};

function UpdateDataWaitHandler(
  state: DefaultStateInterface,
  action: ActionInterface,
) {
  state.updateDataWait = action.payload;
}

function PushNewDataHandler(
  state: DefaultStateInterface,
  action: ActionInterface,
) {
  // Index = 0, place a new user at the begining
  if (action.payload.index == 0) {
    state.data.unshift(action.payload.data);
  }

  // Index -1, place a new user at the end
  else {
    state.data.push(action.payload.data);
  }
}

function UpdateDataHandler(
  state: DefaultStateInterface,
  action: ActionInterface,
) {
  // Find, make sure the item is inside data (matched)
  const matched = state.data.find((nd: any) => nd.tlp == action.payload.tlp);
  // If so
  if (matched) {
    // Get the index of matched item
    const matchedIndex = state.data.indexOf(matched);
    // Replace matched data with new data (merge)
    state.data[matchedIndex] = { ...matched, ...action.payload };
  }
}

function DeleteDataHandler(
  state: DefaultStateInterface,
  action: ActionInterface,
) {
  // Find, make sure the item is inside data (matched)
  const matched = state.data.find((nd: any) => nd.tlp == action.payload.tlp);
  // If so
  if (matched) {
    // Get the index of matched item
    const matchedIndex = state.data.indexOf(matched);
    // Delete mathed user from data
    state.data.splice(matchedIndex, 1);
  }
}

function SetListDataHandler(
  state: DefaultStateInterface,
  action: ActionInterface,
) {
  state.data = action.payload;
}

const AdminUserListSlice = createSlice({
  name: 'admin.user.list',
  initialState: DefaultState,
  reducers: {
    adminUserListSetListData: SetListDataHandler,
    adminUserSetUpdateDataWait: UpdateDataWaitHandler,
    adminUserUpdateData: UpdateDataHandler,
    adminUserPushNewData: PushNewDataHandler,
    adminUserDeleteData: DeleteDataHandler,
  },
});

export const {
  adminUserListSetListData,
  adminUserSetUpdateDataWait,
  adminUserUpdateData,
  adminUserPushNewData,
  adminUserDeleteData,
} = AdminUserListSlice.actions;
export default AdminUserListSlice.reducer;
