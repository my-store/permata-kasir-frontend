import {
  adminConfigAdminOpened,
  adminConfigUserOpened,
} from '../../libs/redux/reducers/admin/admin.config.slice';
import { adminListSetListData } from '../../libs/redux/reducers/admin/admin.list.slice';
import { openAlert } from '../../libs/redux/reducers/components.alert.slice';
import AdminSidebarUpdateProfile from './templates/sidebar/update-profile';
import { getLoginCredentials, refreshToken } from '../../libs/credentials';
import { rootRemoveLoading } from '../../libs/redux/reducers/root.slice';
import AdminConfigAdmin from './config/admin.config.admin';
import AdminConfigUser from './config/admin.config.user';
import type { RootState } from '../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './templates/sidebar';
import { JSONGet } from '../../libs/requests';
import AdminNavbar from './templates/navbar';
import AdminUserInsert from './user/insert';
import { serverUrl } from '../../App';
import AdminUserList from './user';
import AdminInsert from './insert';
import './admin.styles.main.scss';
import { useEffect } from 'react';

export interface AdminGlobalStyleInterface {
  primaryColor: string;
  secondaryColor: string;
}

const globalStyle: AdminGlobalStyleInterface = {
  primaryColor: 'rgb(50, 101, 167)',
  secondaryColor: 'rgb(33, 76, 131)',
};

function AdminHome() {
  return <h1>Homepage for Admin</h1>;
}

function AdminList() {
  const config = useSelector((state: RootState) => state.admin_config.admin);
  const state = useSelector((state: RootState) => state.admin_list);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function load() {
    const { access_token, data } = getLoginCredentials();
    const { maxDisplay } = config.list;

    // --------------- URL ---------------
    let url: string = `/api/admin/?take=${maxDisplay}`;

    /* ---------------------- WHERE STATEMENT ----------------------
    | 1 = Tampilkan semua
    | 2 = Tampilkan yang aktif saja
    | 3 = Tampilkan yang nonaktif saja
    | Aturan diatas untuk menampilkan seluruh admin kecuali akun saya
    */
    let where: any = {
      tlp: { not: data.tlp }, // Except me
    };
    url += `&where=${JSON.stringify(where)}`;

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

      // Refresh login token
      await refreshToken(data.tlp);

      // Re-call this function
      return load();
    }

    dispatch(adminListSetListData(req));
  }

  /* ----------------- UPDATE DATA HANDLER -----------------
  |  1. Activate or Deactivate
  */
  async function update(tlp: string, newData: any) {}

  useEffect(
    () => {
      // Remove user config
      dispatch(adminConfigUserOpened(false));

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
    <div className="Admin-List">
      <div className="Admin-List-Header">
        <p className="Admin-List-Header-Text">Daftar Admin</p>
        <div className="Admin-List-Header-Button-Container">
          <button onClick={() => navigate('/admin/insert')}>Input</button>
          <p className="Admin-Navbar-Link-Sepataror">.</p>
          <button onClick={() => dispatch(adminConfigAdminOpened(true))}>
            Pengaturan
          </button>
        </div>
      </div>

      <div className="Admin-List-Body">
        {state.data.map((d, dx) => (
          <div key={d.id + dx.toString()} className="Admin-List-Item-Container">
            <div className="Admin-List-Item-Image-Container">
              <div
                style={{
                  backgroundImage: `url(${serverUrl + '/static' + d.foto})`,
                }}
                className="Admin-List-Item-Image"
              ></div>
            </div>
            <div className="Admin-List-Item-Info-Container">
              {/* Nama */}
              <p className="Admin-List-Item-Info-Nama">
                <span
                  className="Admin-List-Item-Info-Online"
                  style={{ backgroundColor: d.online ? 'green' : 'red' }}
                ></span>
                {d.nama}
              </p>

              {/* No. Tlp */}
              <p className="Admin-List-Item-Info-Tlp">{d.tlp}</p>

              {/* Active status */}
              <button
                onClick={() => update(d.tlp, { active: !d.active })}
                className="Admin-List-Item-Info-Active-Button"
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
        {state.data.length < 1 && <p className="Admin-List-Empty">Kosong</p>}
      </div>
    </div>
  );
}

function AdminGlobalTemplates({ children, socketConnect }: any) {
  const rootState = useSelector((state: RootState) => state.root);
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

      {/* Page */}
      {children}
    </div>
  );
}

const AdminRoutes = [
  {
    path: '/admin',
    element: (props: any) => (
      <AdminGlobalTemplates {...props}>
        <AdminHome />
      </AdminGlobalTemplates>
    ),
  },
  {
    path: '/admin/admin',
    element: (props: any) => (
      <AdminGlobalTemplates {...props}>
        <AdminList />
      </AdminGlobalTemplates>
    ),
  },
  {
    path: '/admin/admin/insert',
    element: (props: any) => (
      <AdminGlobalTemplates {...props}>
        <AdminInsert />
      </AdminGlobalTemplates>
    ),
  },
  {
    path: '/admin/user',
    element: (props: any) => (
      <AdminGlobalTemplates {...props}>
        <AdminUserList />
      </AdminGlobalTemplates>
    ),
  },
  {
    path: '/admin/user/insert',
    element: (props: any) => (
      <AdminGlobalTemplates {...props}>
        <AdminUserInsert />
      </AdminGlobalTemplates>
    ),
  },
];

export default AdminRoutes;
