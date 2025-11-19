import type { ActionInterface } from '../../store';
import { createSlice } from '@reduxjs/toolkit';

interface DefaultStateInterface {
  opened: boolean;
  boxOpened: boolean;

  updateWait: boolean;
  nama: string;
  tlp: string;
  oldPassword: string;
  newPassword: string;
  foto: string;
}

const DefaultState: DefaultStateInterface = {
  opened: false,
  boxOpened: false,

  updateWait: false,
  nama: '',
  tlp: '',
  oldPassword: '',
  newPassword: '',
  foto: '',
};

function OpenHandler(state: DefaultStateInterface, action: ActionInterface) {
  state.opened = action.payload;
}

function BoxOpenHandler(state: DefaultStateInterface, action: ActionInterface) {
  state.boxOpened = action.payload;
}

function UpdateWaitHandler(
  state: DefaultStateInterface,
  action: ActionInterface,
) {
  state.updateWait = action.payload;
}

function NamaHandler(state: DefaultStateInterface, action: ActionInterface) {
  state.nama = action.payload;
}

function TlpHandler(state: DefaultStateInterface, action: ActionInterface) {
  state.tlp = action.payload;
}

function OldPasswordHandler(
  state: DefaultStateInterface,
  action: ActionInterface,
) {
  state.oldPassword = action.payload;
}

function NewPasswordHandler(
  state: DefaultStateInterface,
  action: ActionInterface,
) {
  state.newPassword = action.payload;
}

function FotoHandler(state: DefaultStateInterface, action: ActionInterface) {
  state.foto = action.payload;
}

const AdminTemplateSidebarSlice = createSlice({
  name: 'admin.templates.sidebar.update-profile',
  initialState: DefaultState,
  reducers: {
    adminTemplatesSidebarUpdateProfileOpen: OpenHandler,
    adminTemplatesSidebarUpdateProfileBoxOpen: BoxOpenHandler,

    adminTemplatesSidebarUpdateProfileWait: UpdateWaitHandler,
    adminTemplatesSidebarUpdateProfileNama: NamaHandler,
    adminTemplatesSidebarUpdateProfileTlp: TlpHandler,
    adminTemplatesSidebarUpdateProfileOldPassword: OldPasswordHandler,
    adminTemplatesSidebarUpdateProfileNewPassword: NewPasswordHandler,
    adminTemplatesSidebarUpdateProfileFoto: FotoHandler,
  },
});

export const {
  adminTemplatesSidebarUpdateProfileOpen,
  adminTemplatesSidebarUpdateProfileBoxOpen,

  adminTemplatesSidebarUpdateProfileWait,
  adminTemplatesSidebarUpdateProfileNama,
  adminTemplatesSidebarUpdateProfileTlp,
  adminTemplatesSidebarUpdateProfileOldPassword,
  adminTemplatesSidebarUpdateProfileNewPassword,
  adminTemplatesSidebarUpdateProfileFoto,
} = AdminTemplateSidebarSlice.actions;
export default AdminTemplateSidebarSlice.reducer;
