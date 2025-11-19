import type { ActionInterface } from '../../store';
import { createSlice } from '@reduxjs/toolkit';

interface DefaultAdminSidebarStateInterface {
  adminData: any;
}

const DefaultAdminSidebarState: DefaultAdminSidebarStateInterface = {
  adminData: null,
};

function SetAdminData(
  state: DefaultAdminSidebarStateInterface,
  action: ActionInterface,
) {
  state.adminData = action.payload;
}

const AdminSidebarSlice = createSlice({
  name: 'admin.templates.sidebar',
  initialState: DefaultAdminSidebarState,
  reducers: {
    adminSidebarSetAdminData: SetAdminData,
  },
});

export const { adminSidebarSetAdminData } = AdminSidebarSlice.actions;
export default AdminSidebarSlice.reducer;
