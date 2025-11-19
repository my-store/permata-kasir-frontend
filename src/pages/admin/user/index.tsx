import {
  adminUserSetUpdateDataWait,
  adminUserListSetListData,
  adminUserPushNewData,
  adminUserUpdateData,
  adminUserDeleteData,
} from '../../../libs/redux/reducers/admin/admin.user.list.slice';
import {
  adminConfigAdminOpened,
  adminConfigUserOpened,
} from '../../../libs/redux/reducers/admin/admin.config.slice';
import { openAlert } from '../../../libs/redux/reducers/components.alert.slice';
import { getLoginCredentials, refreshToken } from '../../../libs/credentials';
import { JSONGet, JSONPatch } from '../../../libs/requests';
import type { RootState } from '../../../libs/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { serverUrl, socket } from '../../../App';
import { useNavigate } from 'react-router-dom';
import './styles/admin.user.styles.main.scss';
import { useEffect } from 'react';

export default function AdminUserList() {
  const config = useSelector((state: RootState) => state.admin_config.user);
  const state = useSelector((state: RootState) => state.admin_user_list);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onlineHandler(tlp: string) {
    // The update-data-handler is supported merge, so
    // No need other data, just online status to be updated
    dispatch(adminUserUpdateData({ tlp, online: true }));
  }

  function offlineHandler(tlp: string) {
    // The update-data-handler is supported merge, so
    // No need other data, just online status to be updated
    dispatch(adminUserUpdateData({ tlp, online: false }));
  }

  function newUserHandler(data: any) {
    const index = config.list.shortByNew ? 0 : -1;
    dispatch(adminUserPushNewData({ index, data }));
  }

  function updateUserHandler(data: any) {
    dispatch(adminUserUpdateData(data));
  }

  function deleteUserHandler(tlp: string) {
    dispatch(adminUserDeleteData({ tlp }));
  }

  function socketListener() {
    socket.on('online', onlineHandler);
    socket.on('offline', offlineHandler);
    socket.on('new-user', newUserHandler);
    socket.on('update-user', updateUserHandler);
    socket.on('delete-user', deleteUserHandler);
  }

  async function load() {
    // Listen incoming socket events
    socketListener();

    const { access_token, data } = getLoginCredentials();
    const { maxDisplay } = config.list;

    // --------------- URL ---------------
    let url: string = `/api/user/?take=${maxDisplay}`;

    // --------------- ORDER STATEMENT ---------------
    if (config.list.shortByNew) {
      url += `&orderBy={"id": "desc"}`;
    }

    /* ---------------------- WHERE STATEMENT ----------------------
    | 1 = Tampilkan semua
    | 2 = Tampilkan yang aktif saja
    | 3 = Tampilkan yang nonaktif saja
    */
    const { display } = config.list;
    // Tidak menampilkan semua
    if (display != 1) {
      let where: any = {
        active: display != 3, // Ketika display=2, maka tampilkan active=true, dan sebaliknya.
      };
      url += `&where=${JSON.stringify(where)}`;
    }

    // Kirim request ke server (GET)
    const req = await JSONGet(url, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // Error occured
    if (req.message) {
      // Some server error response, 401 is Unauthorized
      if (req.statusCode != 401) {
        // Terminate task and display error message
        return dispatch(
          openAlert({
            type: 'Error',
            title: 'Gagal mengambil data',
            body: req.message,
          }),
        );
      }

      // Token expired | Unauthorized | Refresh login token
      await refreshToken(data.tlp);

      // Re-call this function
      return load();
    }

    // Set data state
    dispatch(adminUserListSetListData(req));
  }

  /* ----------------- UPDATE DATA HANDLER -----------------
  |  1. Activate or Deactivate
  */
  async function update(tlp: string, newData: any) {
    // Update is waiting
    if (state.updateDataWait) {
      // Terminate task
      return;
    }

    // Set update wait state
    dispatch(adminUserSetUpdateDataWait(true));

    // Mengambil login credentials pada local-storage
    const { access_token, data } = getLoginCredentials();

    const url: string = `/api/user/${tlp}`;

    // Kirim request ke server (PATCH)
    const req = await JSONPatch(url, {
      headers: { Authorization: `Bearer ${access_token}` },
      body: JSON.stringify(newData),
    });

    // Error occured
    if (req.message) {
      // Some server error response, 401 is Unauthorized
      if (req.statusCode != 401) {
        // Reset update wait state
        dispatch(adminUserSetUpdateDataWait(false));

        // Terminate task and display error message
        return dispatch(
          openAlert({
            type: 'Error',
            title: 'Gagal merubah data',
            body: req.message,
          }),
        );
      }

      // Token expired | Unauthorized | Refresh login token
      await refreshToken(data.tlp);

      // Re-call this function
      return update(tlp, newData);
    }

    // Update data (single, only this data)
    dispatch(adminUserUpdateData(req));

    // Reset update wait state
    dispatch(adminUserSetUpdateDataWait(false));
  }

  useEffect(
    () => {
      // Remove admin config
      dispatch(adminConfigAdminOpened(false));

      // Load data
      load();
    },
    // Ketika ada perubahan state dibawah ini, fungsi diatas akan dipanggil kembali
    [
      // Jenis data yang ditampilkan (semua, aktif dan non-aktif)
      config.list.display,

      // Maksimal jumlah untuk menampilkan data
      config.list.maxDisplay,

      // Urutkan data berdasarkan terbaru atau terlama
      config.list.shortByNew,
    ],
  );

  return (
    <div className="User-List">
      <div className="User-List-Header">
        <p className="User-List-Header-Text">Daftar User</p>
        <div className="User-List-Header-Button-Container">
          <button onClick={() => navigate('/admin/user/insert')}>Input</button>
          <p className="Admin-Navbar-Link-Sepataror">.</p>
          <button onClick={() => dispatch(adminConfigUserOpened(true))}>
            Pengaturan
          </button>
        </div>
      </div>

      <div className="User-List-Body">
        {state.data.map((d, dx) => (
          <div key={d.id + dx.toString()} className="User-List-Item-Container">
            <div className="User-List-Item-Image-Container">
              <div
                style={{
                  backgroundImage: `url(${serverUrl + '/static' + d.foto})`,
                }}
                className="User-List-Item-Image"
              ></div>
            </div>
            <div className="User-List-Item-Info-Container">
              {/* Nama */}
              <p className="User-List-Item-Info-Nama">
                <span
                  className="User-List-Item-Info-Online"
                  style={{ backgroundColor: d.online ? 'green' : 'red' }}
                ></span>
                {d.nama}
              </p>

              {/* No. Tlp */}
              <p className="User-List-Item-Info-Tlp">{d.tlp}</p>

              {/* Active status */}
              <button
                onClick={() => update(d.tlp, { active: !d.active })}
                className="User-List-Item-Info-Active-Button"
                style={{
                  backgroundColor: d.active ? '#c7255bff' : '#25c789ff',
                }}
              >
                {d.active ? 'Blokir' : 'Aktivasi'}
              </button>
            </div>
          </div>
        ))}

        {/* Still Empty */}
        {state.data.length < 1 && <p className="User-List-Empty">Kosong</p>}
      </div>
    </div>
  );
}
