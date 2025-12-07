import {
  adminTemplatesSidebarUpdateProfileBoxOpen,
  adminTemplatesSidebarUpdateProfileFoto,
  adminTemplatesSidebarUpdateProfileNama,
  adminTemplatesSidebarUpdateProfileOpen,
  adminTemplatesSidebarUpdateProfileTlp,
} from "../../../../libs/redux/reducers/admin/admin.templates.sidebar.update-profile.slice";
import { adminSidebarSetAdminData } from "../../../../libs/redux/reducers/admin/admin.templates.sidebar";
import { rootOpenLoading } from "../../../../libs/redux/reducers/root.slice";
import { logout } from "../../../../libs/redux/reducers/login.slice";
import type { RootState } from "../../../../libs/redux/store";
import "./styles/admin.templates.sidebar.styles.main.scss";
import { useSelector, useDispatch } from "react-redux";
import type { AdminGlobalStyleInterface } from "../..";
import { serverUrl, socket } from "../../../../App";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import {
  removeLoginCredentials,
  getLoginCredentials,
} from "../../../../libs/credentials";
import { useEffect } from "react";
import $ from "jquery";

interface AdminSidebarProps {
  globalStyle: AdminGlobalStyleInterface;
}

export default function AdminSidebar(props: AdminSidebarProps) {
  const { globalStyle } = props;

  const sidebarState = useSelector(
    (state: RootState) => state.admin_templates_sidebar
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function load() {
    const { data } = getLoginCredentials();
    dispatch(adminSidebarSetAdminData(data));
  }

  function prepareLogout() {
    // Clean credentials (on local-storage)
    removeLoginCredentials();

    // Display loading animation
    dispatch(rootOpenLoading());

    // Open login page
    dispatch(logout());

    // Disconnect from socket server
    socket.disconnect();
  }

  function openUpdateFoto() {
    // Open update profile container
    dispatch(adminTemplatesSidebarUpdateProfileOpen(true));

    // Open update profile box after 0.25 second (sesuai animation-duration dari container)
    setTimeout(() => {
      // Open update box
      dispatch(adminTemplatesSidebarUpdateProfileBoxOpen(true));

      // Set update-profile state (get from adminData in sidebar slice)
      const { adminData } = sidebarState;
      dispatch(adminTemplatesSidebarUpdateProfileNama(adminData.nama)); // Nama
      dispatch(adminTemplatesSidebarUpdateProfileTlp(adminData.tlp)); // Tlp
      dispatch(
        adminTemplatesSidebarUpdateProfileFoto(
          serverUrl + "/static" + sidebarState.adminData.foto
        )
      );
    }, 250);
  }

  function navigateTo(route: string, className: string) {
    // Sidebar button class
    const sidebarButtonActiveClass = "Admin-Sidebar-Button-Active";

    // Remove all active class first
    const sidebarButtons = $(
      ".Admin-Sidebar .Admin-Sidebar-Button-Container button"
    );
    for (let sb of sidebarButtons) {
      $(sb).removeClass(sidebarButtonActiveClass);
    }

    // Set active class
    const elm = $(`.${className}`);
    elm.addClass(sidebarButtonActiveClass);

    // Update page
    navigate(route);
  }

  useEffect(() => {
    load();
  }, []);

  // Terminate if admin-login-data is null
  if (!sidebarState.adminData) return null;

  return (
    <div className="Admin-Sidebar">
      <div className="Admin-Sidebar-Profile-Container">
        <div className="Admin-Sidebar-Profile-Photo-Container">
          <div
            className="Admin-Sidebar-Profile-Photo-Image"
            style={{
              backgroundImage: `url(${
                serverUrl + "/static" + sidebarState.adminData.foto
              })`,
            }}
          ></div>
          <div
            className="Admin-Sidebar-Profile-Photo-Image-Edit-Button"
            onClick={openUpdateFoto}
          >
            <CiEdit size={25} />
          </div>
        </div>
        <div className="Admin-Sidebar-Profile-Info-Container">
          <p className="Admin-Sidebar-Profile-Info-Name">
            {sidebarState.adminData.nama}
          </p>
          <p className="Admin-Sidebar-Profile-Info-Email">
            {sidebarState.adminData.tlp}
          </p>
        </div>
      </div>

      <div className="Admin-Sidebar-Button-Container">
        {/* Homepage */}
        <button
          onClick={() => navigateTo("/admin", "admin-sidebar-homepage")}
          className="admin-sidebar-homepage"
        >
          Beranda
        </button>

        {/* User */}
        <button
          onClick={() => navigateTo("/admin/user", "admin-sidebar-user-list")}
          className="admin-sidebar-user-list"
        >
          User
        </button>

        {/* Sample Buttons */}
        <button
          onClick={() =>
            navigateTo("/admin/inventaris", "admin-sidebar-inventaris")
          }
          className="admin-sidebar-inventaris"
        >
          Inventaris
        </button>
        <button
          onClick={() => navigateTo("/admin/laporan", "admin-sidebar-laporan")}
          className="admin-sidebar-laporan"
        >
          Laba Rugi & Neraca
        </button>
        <button>Operasional</button>

        {/* Logout */}
        <button onClick={prepareLogout}>Logout</button>
      </div>
    </div>
  );
}
