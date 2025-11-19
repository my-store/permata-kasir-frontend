import { openAlert } from '../../../libs/redux/reducers/components.alert.slice';
import { getLoginCredentials, refreshToken } from '../../../libs/credentials';
import {
  adminInsertSetPassword,
  adminInsertSetWait,
  adminInsertSetFoto,
  adminInsertSetNama,
  adminInsertSetTlp,
} from '../../../libs/redux/reducers/admin/admin.insert.slice';
import type { RootState } from '../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { JSONPost } from '../../../libs/requests';
import './styles/admin.insert.style.main.scss';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../../../App';
import $ from 'jquery';

export default function AdminInsert() {
  const state = useSelector((state: RootState) => state.admin_insert);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const errorAudioURL: string = `${serverUrl}/static/sounds/error.mp3`;
  const errorSound: HTMLAudioElement = new Audio(errorAudioURL);

  function failed(msg: string): void {
    // Play error sound
    errorSound.play();

    // Show alert box
    dispatch(
      openAlert({
        type: 'Error',
        title: 'Gagal menambahkan admin baru',
        body: msg,
      }),
    );

    // Close from insert-wait state
    dispatch(adminInsertSetWait(false));
  }

  async function insert() {
    // Block multiple input request | Wait until finish!
    if (state.insertWait) return;

    // Force user to wait until insert logic is finished
    dispatch(adminInsertSetWait(true));

    const { nama, tlp, password, foto } = state;

    if (nama.length < 1) return failed('Silahkan isi nama admin');
    if (tlp.length < 1) return failed('Silahkan isi no tlp admin');
    if (password.length < 1) return failed('Silahkan isi password admin');
    if (foto.length < 1) return failed('Silahkan pilih foto admin');

    const imageInput: any = $('.Admin-Insert-Form-Image input[name="foto"]')[0];

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('tlp', tlp);
    formData.append('password', password);
    formData.append('foto', imageInput.files[0]);

    // Get login data
    const { access_token, data } = getLoginCredentials();

    // Insert data
    const insertReq = await JSONPost('/api/admin', {
      headers: { Authorization: `Bearer ${access_token}` },
      body: formData,
    });

    // Token expired
    if (insertReq.message) {
      // Refresh login token
      await refreshToken(data.tlp);

      // Close from insert-wait state
      dispatch(adminInsertSetWait(false));

      // Re-call this function
      return insert();
    }

    // Insert success

    // Show success message
    dispatch(
      openAlert({
        type: 'Success',
        title: 'Admin baru berhasil ditambahkan',
        body: `Nama: ${nama}\nTlp: ${tlp}`,
      }),
    );

    // Reset form
    resetForm();
  }

  function resetForm() {
    dispatch(adminInsertSetNama(''));
    dispatch(adminInsertSetTlp(''));
    dispatch(adminInsertSetPassword(''));
    dispatch(adminInsertSetFoto(''));

    // Close from insert-wait state
    dispatch(adminInsertSetWait(false));
  }

  // function validate() {}

  // function listenChange() {}

  return (
    <div className="Admin-Insert">
      <div className="Admin-Insert-Box">
        <form onSubmit={(e) => e.preventDefault()} method="POST">
          <div className="Admin-Insert-Form-Group">
            <label>Nama</label>
            <input
              type="text"
              name="nama"
              defaultValue={state.nama}
              onChange={(e) => dispatch(adminInsertSetNama(e.target.value))}
            />
          </div>

          <div className="Admin-Insert-Form-Group">
            <label>Tlp</label>
            <input
              type="text"
              name="tlp"
              defaultValue={state.tlp}
              onChange={(e) => dispatch(adminInsertSetTlp(e.target.value))}
            />
          </div>

          <div className="Admin-Insert-Form-Group">
            <label>Katasandi</label>
            <input
              type="text"
              name="password"
              defaultValue={state.password}
              onChange={(e) => dispatch(adminInsertSetPassword(e.target.value))}
            />
          </div>

          <div className="Admin-Insert-Form-Image">
            <input
              type="file"
              name="foto"
              onChange={(e: any) => {
                if (!e.target.files || e.target.files.length < 1) {
                  return;
                }
                const reader = new FileReader();
                reader.onload = (evt) => {
                  dispatch(adminInsertSetFoto(evt.target?.result));
                };
                reader.readAsDataURL(e.target.files[0]);
              }}
            />
            <div
              className="Admin-Insert-Form-Image-Preview"
              style={{
                backgroundImage:
                  state.foto.length > 0 ? `url(${state.foto})` : '',
              }}
              onClick={() => {
                const imageInput = $(
                  ".Admin-Insert-Form-Image input[name='foto']",
                )[0];
                imageInput.click();
              }}
            >
              {state.foto.length < 1 && (
                <p className="Admin-Insert-Form-Image-Label">
                  Tambah <br /> Foto
                </p>
              )}
            </div>
          </div>

          <div className="Admin-Insert-Form-Buttons">
            <button type="button" onClick={insert}>
              Simpan
            </button>
            <button
              type="button"
              onClick={() => {
                // Reset form first
                resetForm();

                // Redirect to homepage
                navigate('/admin');
              }}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
