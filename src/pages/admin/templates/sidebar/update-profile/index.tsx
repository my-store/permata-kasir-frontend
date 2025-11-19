import {
  adminTemplatesSidebarUpdateProfileNewPassword,
  adminTemplatesSidebarUpdateProfileOldPassword,
  adminTemplatesSidebarUpdateProfileBoxOpen,
  adminTemplatesSidebarUpdateProfileFoto,
  adminTemplatesSidebarUpdateProfileOpen,
  adminTemplatesSidebarUpdateProfileWait,
} from '../../../../../libs/redux/reducers/admin/admin.templates.sidebar.update-profile.slice';
import { adminSidebarSetAdminData } from '../../../../../libs/redux/reducers/admin/admin.templates.sidebar';
import { openAlert } from '../../../../../libs/redux/reducers/components.alert.slice';
import { rootOpenLoading } from '../../../../../libs/redux/reducers/root.slice';
import './styles/admin.templates.sidebar.update-profile.styles.main.scss';
import { logout } from '../../../../../libs/redux/reducers/login.slice';
import { FormPatch, JSONPost } from '../../../../../libs/requests';
import type { RootState } from '../../../../../libs/redux/store';
import type { AdminGlobalStyleInterface } from '../../..';
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl, socket } from '../../../../../App';
import { MdClose } from 'react-icons/md';
import $ from 'jquery';
import {
  removeLoginCredentials,
  getLoginCredentials,
  setLoginCredentials,
  refreshToken,
  getUserData,
} from '../../../../../libs/credentials';
import type { CSSProperties } from 'react';

interface AdminSidebarProps {
  globalStyle: AdminGlobalStyleInterface;
}

export default function AdminSidebarUpdateProfile(props: AdminSidebarProps) {
  const updateProfileState = useSelector(
    (state: RootState) => state.admin_templates_sidebar_update_profile,
  );
  const sidebarState = useSelector(
    (state: RootState) => state.admin_templates_sidebar,
  );
  const dispatch = useDispatch();
  const { globalStyle } = props;

  // Colors
  const { primaryColor } = globalStyle;

  const errorAudioURL: string = `${serverUrl}/static/sounds/error.mp3`;
  const errorSound: HTMLAudioElement = new Audio(errorAudioURL);

  function failed(msg: string): void {
    // Play error sound
    errorSound.play();

    // Show alert box
    dispatch(
      openAlert({
        type: 'Error',
        title: 'Gagal merubah data',
        body: msg,
      }),
    );

    // Reset update-wait state
    dispatch(adminTemplatesSidebarUpdateProfileWait(false));
  }

  async function save() {
    // Block multiple input request | Wait until finish!
    if (updateProfileState.updateWait) return;

    // Force user to wait until update logic is finished
    dispatch(adminTemplatesSidebarUpdateProfileWait(true));

    // State data
    const { nama, tlp, foto, oldPassword, newPassword } = updateProfileState;

    // Sidebar state data
    const { adminData } = sidebarState;

    // Login data
    const { data, ...loginCred } = getLoginCredentials();

    // Update state (jika tidak ada perubahan data, tidak akan mengirim permintaan ke server)
    let updatedState: boolean = false;
    const updatedData = new FormData();

    // Perubahan nama
    if (nama != adminData.nama) {
      // Nama tidak terisi (kosong)
      if (nama.length < 1) {
        // Terminate task
        return failed('Mohon isi nama!');
      }

      // Ubah updated-state
      updatedState = true;

      // Masukan nama ke updated-state
      updatedData.append('nama', nama);
    }

    // Perubahan tlp
    if (tlp != adminData.tlp) {
      // No. Tlp tidak terisi (kosong)
      if (tlp.length < 1) {
        // Terminate task
        return failed('Mohon isi No. Tlp!');
      }

      // Ubah updated-state
      updatedState = true;

      // Masukan tlp ke updated-state
      updatedData.append('tlp', tlp);
    }

    // Perubahan password
    // Perubahan password hanya dilakukan pengecekan apakah new-password terisi
    if (newPassword.length > 0) {
      // Cek apakah old-password terisi
      if (oldPassword.length < 1) {
        // old-password tidak terisi, terminate task
        return failed('Mohon isi password lama!');
      }

      let checkPassword: any;
      try {
        // Gunakan tlp lama (menghindari jika tlp telah berubah)
        checkPassword = await JSONPost(`/api/admin/verify-password/${tlp}`, {
          headers: { Authorization: `Bearer ${loginCred.access_token}` },
          body: JSON.stringify({ password: oldPassword }),
        });

        // Error occured
        if (checkPassword.message) {
          // Some server error response, 401 is Unauthorized
          if (checkPassword.statusCode != 401) {
            // Reset update-wait state
            dispatch(adminTemplatesSidebarUpdateProfileWait(false));

            // Terminate task and display error message
            return dispatch(
              openAlert({
                type: 'Error',
                title: 'Gagal merubah data',
                body: checkPassword.message,
              }),
            );
          }

          // Refresh login token
          await refreshToken(adminData.tlp);

          // Re-call this function
          return save();
        }

        const { result } = checkPassword;

        // Password lama salah
        if (!result) {
          // Terminate task
          return failed('Password lama salah!');
        }
      } catch {
        // Terminate task
        return failed('Gagal merubah data!');
      }

      // Ubah updated-state
      updatedState = true;

      // Masukan password ke updated-state
      updatedData.append('password', newPassword);
    }

    // Perubahan foto
    const updateStateFoto = foto.split('/static').pop();
    const sidebarStateFoto = adminData.foto;
    if (updateStateFoto != sidebarStateFoto) {
      // Ubah updated-state
      updatedState = true;

      // Masukan foto ke updated-state
      const fotoObj: any = $('#Admin-Sidebar-Update-Profile-Foto-Input')[0];
      updatedData.append('foto', fotoObj.files[0]);
    }

    // Jika tidak ada perubahan, lanjutkan kirim permintaan ke server
    if (updatedState) {
      let tryUpdate: any;
      try {
        // Gunakan tlp lama (menghindari jika tlp telah berubah)
        tryUpdate = await FormPatch(`/api/admin/${tlp}`, {
          headers: {
            Authorization: `Bearer ${loginCred.access_token}`,
          },
          body: updatedData,
        });

        // Error occured
        if (tryUpdate.message) {
          // Some server error response, 401 is Unauthorized
          if (tryUpdate.statusCode != 401) {
            // Reset update-wait state
            dispatch(adminTemplatesSidebarUpdateProfileWait(false));

            // Terminate task and display error message
            return dispatch(
              openAlert({
                type: 'Error',
                title: 'Gagal merubah data',
                body: tryUpdate.message,
              }),
            );
          }

          // Refresh login token
          await refreshToken(adminData.tlp);

          // Re-call this function
          return save();
        }
      } catch {
        // Terminate task
        return failed('Gagal merubah data!');
      }

      // Set a new login credentials on local storage
      const newData = await getUserData(tlp, loginCred);
      setLoginCredentials({ ...loginCred, data: newData });

      // Broadcast update-admin event
      socket.emit('update-admin', tryUpdate);

      // Jika ada perubahan tlp atau password
      if (updatedData.get('tlp') || updatedData.get('password')) {
        // Paksa admin untuk login kembali
        prepareLogout();
      }

      // Perubahan yang lain (nama / foto)
      else {
        // Reset sidebar data
        const { data } = getLoginCredentials();
        dispatch(adminSidebarSetAdminData(data));
      }
    }

    // Reset update-wait state
    dispatch(adminTemplatesSidebarUpdateProfileWait(false));

    // Close update
    closeUpdate();
  }

  function closeUpdate() {
    // Remove update profile box
    dispatch(adminTemplatesSidebarUpdateProfileBoxOpen(false));

    // Remove update profile container
    dispatch(adminTemplatesSidebarUpdateProfileOpen(false));
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

  function updateFoto(target: any) {
    if (!target.files || target.files.length < 1) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      dispatch(adminTemplatesSidebarUpdateProfileFoto(evt.target?.result));
    };
    reader.readAsDataURL(target.files[0]);
  }

  function updateNewPassword(value: string) {
    dispatch(adminTemplatesSidebarUpdateProfileNewPassword(value));
  }

  function updateOldPassword(value: string) {
    dispatch(adminTemplatesSidebarUpdateProfileOldPassword(value));
  }

  function openInputFoto() {
    const imageInput = $('#Admin-Sidebar-Update-Profile-Foto-Input')[0];
    imageInput.click();
  }

  // ---------------- CONTAINER & BOX STATES ----------------
  const { opened, boxOpened } = updateProfileState;

  // ---------------- CONTAINER & BOX CLASSES ----------------
  const containerClass: string = opened
    ? 'Admin-Sidebar-Update-Profile Admin-Sidebar-Update-Profile-Active'
    : 'Admin-Sidebar-Update-Profile';
  const boxClass: string = boxOpened
    ? 'Admin-Sidebar-Update-Profile-Box Admin-Sidebar-Update-Profile-Box-Active'
    : 'Admin-Sidebar-Update-Profile-Box';

  // ---------------- FOTO STYLES ----------------
  const { foto } = updateProfileState;
  const fotoBg: string = foto.length > 0 ? `url(${foto})` : '';
  const fotoStyle: CSSProperties = { backgroundImage: fotoBg };

  // ---------------- HEADER STYLES ----------------
  const headerStyle: CSSProperties = { backgroundColor: primaryColor };

  return (
    <div className={containerClass}>
      <div className={boxClass}>
        <div
          className="Admin-Sidebar-Update-Profile-Header"
          style={headerStyle}
        >
          <p className="Admin-Sidebar-Update-Profile-Header-Text">
            Ubah Profile
          </p>
          <div
            className="Admin-Sidebar-Update-Profile-Header-Close-Button"
            onClick={closeUpdate}
          >
            <MdClose />
          </div>
        </div>
        <div className="Admin-Sidebar-Update-Profile-Body">
          {/* Nama */}
          <div className="Admin-Sidebar-Update-Profile-Item">
            <label>Nama</label>
            <input
              type="text"
              name="nama"
              defaultValue={updateProfileState.nama}
            />
          </div>

          {/* No. Tlp */}
          <div className="Admin-Sidebar-Update-Profile-Item">
            <label>No. Tlp</label>
            <input
              type="text"
              name="tlp"
              defaultValue={updateProfileState.tlp}
            />
          </div>

          {/* Password lama */}
          <div className="Admin-Sidebar-Update-Profile-Item">
            <label>Password Lama</label>
            <input
              type="text"
              name="old-password"
              onChange={({ target: { value } }) => updateOldPassword(value)}
            />
          </div>

          {/* Password baru */}
          <div className="Admin-Sidebar-Update-Profile-Item">
            <label>Password Baru</label>
            <input
              type="text"
              name="new-password"
              onChange={({ target: { value } }) => updateNewPassword(value)}
            />
          </div>

          {/* Foto */}
          <div className="Admin-Sidebar-Update-Profile-Foto">
            <input
              id="Admin-Sidebar-Update-Profile-Foto-Input"
              type="file"
              name="foto"
              onChange={({ target }) => updateFoto(target)}
            />
            <div
              className="Admin-Sidebar-Update-Profile-Foto-Preview"
              style={fotoStyle}
              onClick={openInputFoto}
            >
              {updateProfileState.foto.length < 1 && (
                <p className="Admin-Sidebar-Update-Profile-Foto-Label">
                  Pilih Foto
                </p>
              )}
            </div>
          </div>

          <div className="Admin-Sidebar-Update-Profile-Button-Container">
            <button onClick={save}>Simpan</button>
            <button onClick={closeUpdate}>Batal</button>
          </div>
        </div>
      </div>
    </div>
  );
}
