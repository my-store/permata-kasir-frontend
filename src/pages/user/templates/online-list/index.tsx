import { rootOpenLoading } from '../../../../libs/redux/reducers/root.slice';
import { logout } from '../../../../libs/redux/reducers/login.slice';
import {
  setUserOnlineLoading,
  setUserOnlineData,
  closeUserOnline,
  setUserOffline,
  openUserOnline,
  setUserOnline,
} from '../../../../libs/redux/reducers/user/user.online-list.slice';
import './styles/user.templates.online-list.styles.main.scss';
import type { RootState } from '../../../../libs/redux/store';
import { SmallLoading } from '../../../../components/loading';
import { useDispatch, useSelector } from 'react-redux';
import type { UserGlobalStyleInterface } from '../..';
import { JSONGet } from '../../../../libs/requests';
import { serverUrl, socket } from '../../../../App';
import { IoMdClose } from 'react-icons/io';
import { FaUsers } from 'react-icons/fa6';
import {
  getLoginCredentials,
  refreshToken,
  removeLoginCredentials,
} from '../../../../libs/credentials';
import { useEffect } from 'react';

interface OnlineListProps {
  globalStyle: UserGlobalStyleInterface;
}

export function UserOnlineListTrigger() {
  const dispatch = useDispatch();

  async function loadOnline() {
    const { access_token, data } = getLoginCredentials();

    // --------------- REQUEST CONFIGURATION ---------------
    const req_conf: RequestInit = {
      headers: { Authorization: `Bearer ${access_token}` },
    };

    // --------------- ADMIN URL ---------------
    let admin_url: string = '/api/admin';

    // Fetch admin data
    const admin = await JSONGet(admin_url, req_conf);

    // --------------- USER URL ---------------
    let user_url: string = '/api/user';

    /* ------------------- ACTIVE FILTER -------------------
    | Don't show blocked users)
    */

    /* ------------------- WHERE STATEMENT -------------------
    | 1. Except me
    | 2. Don't show blocked users)
    */
    let where: any = {
      tlp: { not: data.tlp },
      active: true,
    };
    user_url += `/?where=${JSON.stringify(where)}`;

    // Fetch user data
    const user = await JSONGet(user_url, req_conf);

    // Token expired
    if (admin.message || user.message) {
      // Refresh login token
      await refreshToken(data.tlp);

      // Re-call this function
      return loadOnline();
    }

    // Set user online box data
    dispatch(setUserOnlineData([...admin, ...user]));

    // Remove loading animation after 0,5 second
    setTimeout(() => dispatch(setUserOnlineLoading(false)), 500);
  }

  function triggerHandler() {
    // Open user online box
    dispatch(openUserOnline());

    // Open loading animation
    dispatch(setUserOnlineLoading(true));

    // Load online data
    loadOnline();
  }

  return (
    <div className="Online-List-Trigger-Btn" onClick={triggerHandler}>
      <FaUsers />
    </div>
  );
}

export function UserOnlineList(props: OnlineListProps) {
  const { globalStyle } = props;

  const userOnlineState = useSelector(
    (state: RootState) => state.user_onlineList,
  );
  const dispatch = useDispatch();

  function onlineHandler(tlp: string) {
    dispatch(setUserOnline(tlp));
  }

  function offlineHandler(tlp: string) {
    dispatch(setUserOffline(tlp));
  }

  function newUserHandler(data: any) {
    console.log(typeof data);
    console.log(data);
    return;
    const newData = [...userOnlineState.data, data];
    dispatch(setUserOnlineData(newData));
  }

  function updateUserHandler(data: any) {
    console.log(typeof data);
    console.log(data);
  }

  function deleteUserHandler(tlp: string) {
    const { data } = getLoginCredentials();

    // Admin is deletes my account
    if (data.tlp == tlp) {
      // Don't forget to emit offline first before delete local storage
      const { data, role } = getLoginCredentials();
      socket.emit('offline', { tlp: data.tlp, role });

      // Clean credentials (on local-storage)
      removeLoginCredentials();

      // Display loading animation
      dispatch(rootOpenLoading());

      // Force me to open login page (also remove login credentials)
      dispatch(logout());
    }

    // Admin deletes other acccount
    else {
      // Make sure online box is opened
      if (userOnlineState.opened) {
        // Set a new list of online users
        const newData = userOnlineState.data.filter((d) => d.tlp != tlp);
        dispatch(setUserOnlineData(newData));
      }
    }
  }

  function socketListener() {
    socket.on('online', onlineHandler);
    socket.on('offline', offlineHandler);
    socket.on('new-user', newUserHandler);
    socket.on('update-user', updateUserHandler);
    socket.on('delete-user', deleteUserHandler);
  }

  useEffect(() => {
    socketListener();
  }, []);

  return (
    <div className="Online-List">
      <div
        className="Online-List-Header"
        style={{ backgroundColor: globalStyle.primaryColor }}
      >
        <div className="Online-List-Header-Left">
          <p className="Online-List-Header-Text">Pengguna</p>
        </div>
        <div className="Online-List-Header-Right">
          <div
            className="Online-List-Close-Trigger"
            onClick={() => dispatch(closeUserOnline())}
          >
            <IoMdClose />
          </div>
        </div>
      </div>
      <div className="Online-List-Body">
        {/* Tinggi loading harus sesuai dengan "Online-List-Body" */}
        {userOnlineState.isLoading && (
          <SmallLoading
            color={globalStyle.primaryColor}
            size="small"
            width="100%"
            height="257px"
          />
        )}
        {!userOnlineState.isLoading &&
          userOnlineState.data.map((d, dx) => {
            return (
              <div key={dx + d.id} className="Online-List-Item">
                <div
                  className="Online-List-Item-Image"
                  style={{
                    backgroundImage: `url(${serverUrl}/static/${d.foto})`,
                  }}
                ></div>
                <div className="Online-List-Item-Info">
                  <p className="Online-List-Item-Name">{d.nama}</p>
                  <p className="Online-List-Item-Tlp">{d.tlp}</p>
                </div>
                <div
                  className="Online-List-Item-Indicator"
                  style={{
                    backgroundColor: d.online ? '#17b045' : '#e03450',
                  }}
                ></div>
              </div>
            );
          })}
      </div>
      <div className="Online-List-Footer"></div>
    </div>
  );
}
