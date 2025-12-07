import AdminSidebarUpdateProfile from "./templates/sidebar/update-profile";
import { rootRemoveLoading } from "../../libs/redux/reducers/root.slice";
import {
  AdminOnlineListTrigger,
  AdminOnlineList,
} from "./templates/online-list";
import AdminConfigAdmin from "./config/admin.config.admin";
import AdminConfigUser from "./config/admin.config.user";
import type { RootState } from "../../libs/redux/store";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "./templates/sidebar";
import AdminNavbar from "./templates/navbar";
import AdminUserInsert from "./user/insert";
import AdminInventaris from "./inventaris";
import AdminLaporan from "./laporan";
import AdminUserList from "./user";
import "./admin.styles.main.scss";
import { useEffect } from "react";

export interface AdminGlobalStyleInterface {
  primaryColor: string;
  secondaryColor: string;
}

const globalStyle: AdminGlobalStyleInterface = {
  primaryColor: "rgb(50, 101, 167)",
  secondaryColor: "rgb(33, 76, 131)",
};

function AdminHome() {
  return <h1>Homepage for Admin</h1>;
}

function AdminGlobalTemplates({ children, socketConnect }: any) {
  const rootState = useSelector((state: RootState) => state.root);
  const onlineState = useSelector(
    (state: RootState) => state.admin_online_list
  );
  const dispatch = useDispatch();

  function socketListener() {}

  // When the page is loaded or refreshed
  async function load() {
    socketListener();

    // Remove loading animation after 3 second
    setTimeout(() => dispatch(rootRemoveLoading()), 3000);
  }

  useEffect(() => {
    // Connect to socket server, before any tasks
    socketConnect(load);
  }, []);

  // Invisible if still loading
  if (rootState.isLoading) return null;

  return (
    <div className="Admin">
      <AdminNavbar globalStyle={globalStyle} />
      <AdminConfigAdmin globalStyle={globalStyle} />
      <AdminConfigUser globalStyle={globalStyle} />

      {/* Sidebar */}
      <AdminSidebar globalStyle={globalStyle} />
      <AdminSidebarUpdateProfile globalStyle={globalStyle} />

      {/* Online list */}
      {onlineState.opened && <AdminOnlineList globalStyle={globalStyle} />}
      <AdminOnlineListTrigger />

      {/* Page */}
      {children}
    </div>
  );
}

const AdminRoutes = [
  {
    path: "/admin",
    element: (props: any) => (
      <AdminGlobalTemplates {...props}>
        <AdminHome />
      </AdminGlobalTemplates>
    ),
  },
  {
    path: "/admin/user",
    element: (props: any) => (
      <AdminGlobalTemplates {...props}>
        <AdminUserList />
      </AdminGlobalTemplates>
    ),
  },
  {
    path: "/admin/user/insert",
    element: (props: any) => (
      <AdminGlobalTemplates {...props}>
        <AdminUserInsert />
      </AdminGlobalTemplates>
    ),
  },
  {
    path: "/admin/inventaris",
    element: (props: any) => (
      <AdminGlobalTemplates {...props}>
        <AdminInventaris />
      </AdminGlobalTemplates>
    ),
  },
  {
    path: "/admin/laporan",
    element: (props: any) => (
      <AdminGlobalTemplates {...props}>
        <AdminLaporan />
      </AdminGlobalTemplates>
    ),
  },
];

export default AdminRoutes;
