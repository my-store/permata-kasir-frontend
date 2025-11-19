import type { ActionInterface } from '../../store';
import { createSlice } from '@reduxjs/toolkit';

interface DefaultUserSidebarStateInterface {
  userData: any;
}

const DefaultUserSidebarState: DefaultUserSidebarStateInterface = {
  userData: null,
};

function SetUserData(
  state: DefaultUserSidebarStateInterface,
  action: ActionInterface,
) {
  state.userData = action.payload;
}

const UserSidebarSlice = createSlice({
  name: 'user.sidebar',
  initialState: DefaultUserSidebarState,
  reducers: {
    userSidebarSetUserData: SetUserData,
  },
});

export const { userSidebarSetUserData } = UserSidebarSlice.actions;
export default UserSidebarSlice.reducer;
