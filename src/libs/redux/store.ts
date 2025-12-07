import AdminTemplatesSidebarReducer from "./reducers/admin/admin.templates.sidebar.update-profile.slice";
import AdminOnlineListReducer from "./reducers/admin/admin.online-list.slice";
import AdminSidebarReducer from "./reducers/admin/admin.templates.sidebar";
import AdminUserListReducer from "./reducers/admin/admin.user.list.slice";
import AdminUserInsertReducer from "./reducers/admin/user.insert.slice";
import AdminInsertReducer from "./reducers/admin/admin.insert.slice";
import AdminConfigReducer from "./reducers/admin/admin.config.slice";
import UserSidebarReducer from "./reducers/user/user.sidebar.slice";
import AlertReducer from "./reducers/components.alert.slice";
import SocketReducer from "./reducers/socket.slice";
import { configureStore } from "@reduxjs/toolkit";
import LoginReducer from "./reducers/login.slice";
import RootReducer from "./reducers/root.slice";

export interface ActionInterface {
  payload: any;
  type: string;
}

export const store = configureStore({
  reducer: {
    root: RootReducer,
    socket: SocketReducer,
    login: LoginReducer,
    component_alert: AlertReducer,

    user_sidebar: UserSidebarReducer,

    admin_config: AdminConfigReducer,
    admin_insert: AdminInsertReducer,
    admin_user_list: AdminUserListReducer,
    admin_user_insert: AdminUserInsertReducer,
    admin_templates_sidebar: AdminSidebarReducer,
    admin_online_list: AdminOnlineListReducer,
    admin_templates_sidebar_update_profile: AdminTemplatesSidebarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
