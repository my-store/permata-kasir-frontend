import type { ActionInterface } from '../../store';
import { createSlice } from '@reduxjs/toolkit';

interface DefaultAdminListStateInterface {
  data: any[];
}

const DefaultAdminListState: DefaultAdminListStateInterface = {
  data: [],
};

function SetListData(
  state: DefaultAdminListStateInterface,
  action: ActionInterface,
) {
  state.data = action.payload;
}

const AdminListSlice = createSlice({
  name: 'admin.admin.list',
  initialState: DefaultAdminListState,
  reducers: {
    adminListSetListData: SetListData,
  },
});

export const { adminListSetListData } = AdminListSlice.actions;
export default AdminListSlice.reducer;
