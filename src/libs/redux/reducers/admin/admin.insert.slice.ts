import type { ActionInterface } from '../../store';
import { createSlice } from '@reduxjs/toolkit';

interface DefaultAdminInsertStateInterface {
  nama: string;
  tlp: string;
  password: string;
  foto: string;

  insertWait: boolean;
}

const DefaultAdminInsertState: DefaultAdminInsertStateInterface = {
  nama: '',
  tlp: '',
  password: '',
  foto: '',

  insertWait: false,
};

function SetNamaHandler(
  state: DefaultAdminInsertStateInterface,
  action: ActionInterface,
) {
  state.nama = action.payload;
}

function SetTlpHandler(
  state: DefaultAdminInsertStateInterface,
  action: ActionInterface,
) {
  state.tlp = action.payload;
}

function SetPasswordHandler(
  state: DefaultAdminInsertStateInterface,
  action: ActionInterface,
) {
  state.password = action.payload;
}

function SetFotoHandler(
  state: DefaultAdminInsertStateInterface,
  action: ActionInterface,
) {
  state.foto = action.payload;
}

function SetWaitHandler(
  state: DefaultAdminInsertStateInterface,
  action: ActionInterface,
) {
  state.insertWait = action.payload;
}

const AdminInsertSlice = createSlice({
  name: 'admin.insert',
  initialState: DefaultAdminInsertState,
  reducers: {
    adminInsertSetNama: SetNamaHandler,
    adminInsertSetTlp: SetTlpHandler,
    adminInsertSetPassword: SetPasswordHandler,
    adminInsertSetFoto: SetFotoHandler,
    adminInsertSetWait: SetWaitHandler,
  },
});

export const {
  adminInsertSetNama,
  adminInsertSetTlp,
  adminInsertSetPassword,
  adminInsertSetFoto,
  adminInsertSetWait,
} = AdminInsertSlice.actions;
export default AdminInsertSlice.reducer;
