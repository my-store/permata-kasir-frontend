import { userSidebarSetUserData } from '../../../../libs/redux/reducers/user/user.sidebar.slice';
import { rootOpenLoading } from '../../../../libs/redux/reducers/root.slice';
import { logout } from '../../../../libs/redux/reducers/login.slice';
import type { RootState } from '../../../../libs/redux/store';
import './styles/user.templates.sidebar.styles.main.scss';
import { useDispatch, useSelector } from 'react-redux';
import type { UserGlobalStyleInterface } from '../..';
import { serverUrl, socket } from '../../../../App';
import { useNavigate } from 'react-router';
import {
  removeLoginCredentials,
  getLoginCredentials,
} from '../../../../libs/credentials';
import { useEffect } from 'react';

interface UserSidebarProps {
  globalStyle: UserGlobalStyleInterface;
}

export default function UserSidebar(props: UserSidebarProps) {
  const { globalStyle } = props;

  const sidebarState = useSelector((state: RootState) => state.user_sidebar);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Colors
  const { primaryColor } = globalStyle;

  // Navbar config
  const { navbarHeight } = globalStyle;

  // Sidebar config
  const { sidebarWidth } = globalStyle;

  function load() {
    const { data } = getLoginCredentials();
    dispatch(userSidebarSetUserData(data));
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

  useEffect(() => {
    load();
  }, []);

  // Terminate if user-login-data is null
  if (!sidebarState.userData) return null;

  return (
    <div
      className="User-Sidebar"
      style={{
        paddingTop: `${navbarHeight}px`,
        width: `${sidebarWidth}px`,
      }}
    >
      <div className="User-Sidebar-Profile-Container">
        <div
          className="User-Sidebar-Profile-Photo-Container"
          style={{
            width: `${sidebarWidth}px`,
            height: `${sidebarWidth}px`,
          }}
        >
          <div
            className="User-Sidebar-Profile-Photo-Image"
            style={{
              width: `${sidebarWidth - 15}px`,
              height: `${sidebarWidth - 15}px`,
              backgroundImage: `url(${serverUrl + '/static' + sidebarState.userData.foto})`,
            }}
          ></div>
        </div>
        <div className="User-Sidebar-Profile-Info-Container">
          <p className="User-Sidebar-Profile-Info-Name">
            {sidebarState.userData.nama}
          </p>
          <p className="User-Sidebar-Profile-Info-Email">
            {sidebarState.userData.tlp}
          </p>
        </div>
      </div>

      <div className="User-Sidebar-Button-Container">
        <button
          style={{ color: primaryColor }}
          onClick={() => navigate('/user')}
        >
          Beranda
        </button>
        <button
          style={{ color: primaryColor }}
          onClick={() => navigate('/user/inventaris')}
        >
          Inventaris
        </button>
        <button
          style={{ color: primaryColor }}
          onClick={() => navigate('/user/laporan')}
        >
          Laporan
        </button>
        <button
          style={{ color: primaryColor }}
          onClick={(e) => {
            e.preventDefault();
            prepareLogout();
          }}
        >
          Keluar
        </button>
      </div>
    </div>
  );
}
