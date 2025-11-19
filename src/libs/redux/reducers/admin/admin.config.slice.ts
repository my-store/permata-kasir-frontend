import type { ActionInterface } from '../../store';
import { createSlice } from '@reduxjs/toolkit';

export interface SelectOptionInterface {
  label: string;
  value: any;
}

export const AdminConfigUserListDisplayItems: SelectOptionInterface[] = [
  {
    label: 'Semua',
    value: 1,
  },
  {
    label: 'Aktif',
    value: 2,
  },
  {
    label: 'Nonaktif',
    value: 3,
  },
];

export const AdminConfigAdminListDisplayItems: SelectOptionInterface[] = [
  {
    label: 'Semua',
    value: 1,
  },
  {
    label: 'Aktif',
    value: 2,
  },
  {
    label: 'Nonaktif',
    value: 3,
  },
];

interface UserListConfigInterface {
  ready: boolean;
  display: number;
  shortByNew: boolean;
  maxDisplay: number;
  maxLoadMore: number;
  maxSearchDisplay: number;
}

interface UserInsertConfigInterface {
  autoActivate: boolean;
}

interface AdminListConfigInterface {
  ready: boolean;
  display: number;
  shortByNew: boolean;
  maxDisplay: number;
  maxLoadMore: number;
  maxSearchDisplay: number;
}

interface AdminInsertConfigInterface {}

export interface UserConfigInterface {
  opened: boolean;
  list: UserListConfigInterface;
  insert: UserInsertConfigInterface;
}

export interface AdminConfigInterface {
  opened: boolean;
  list: AdminListConfigInterface;
  insert: AdminInsertConfigInterface;
}

interface DefaultAdminConfigInterface {
  admin: AdminConfigInterface;
  user: UserConfigInterface;
}

export const DefaultAdminConfigState: DefaultAdminConfigInterface = {
  admin: {
    opened: false,
    list: {
      ready: false,
      display: 1, // Default = Tampilkan semua admin (kecuali saya pastinya)
      shortByNew: true,
      maxDisplay: 50,
      maxLoadMore: 15,
      maxSearchDisplay: 50,
    },
    insert: {}, // Pending ...
  },
  user: {
    opened: false,
    list: {
      ready: false,
      display: 1, // Default = Tampilkan semua user
      shortByNew: true,
      maxDisplay: 50,
      maxLoadMore: 15,
      maxSearchDisplay: 50,
    },
    insert: {
      autoActivate: true,
    },
  },
};

// ADMIN CONFIG

function ConfigAdminOpenedHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.admin.opened = action.payload;
}

function ConfigAdminListReadyHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.admin.list.ready = action.payload;
}

function ConfigAdminListDisplayHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.admin.list.display = action.payload;
}

function ConfigAdminListMaxSearchDisplayHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.admin.list.maxSearchDisplay = action.payload;
}

function ConfigAdminListMaxLoadMoreHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.admin.list.maxLoadMore = action.payload;
}

function ConfigAdminListMaxDisplayHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.admin.list.maxDisplay = action.payload;
}

function ConfigAdminListShortByNewHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.admin.list.shortByNew = action.payload;
}

// USER CONFIG

function ConfigUserOpenedHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.user.opened = action.payload;
}

function ConfigUserListReadyHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.user.list.ready = action.payload;
}

function ConfigUserListDisplayHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.user.list.display = action.payload;
}

function ConfigUserListShortByNewHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.user.list.shortByNew = action.payload;
}

function ConfigUserListMaxDisplayHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.user.list.maxDisplay = action.payload;
}

function ConfigUserListMaxLoadMoreHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.user.list.maxLoadMore = action.payload;
}

function ConfigUserListMaxSearchDisplayHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.user.list.maxSearchDisplay = action.payload;
}

function ConfigUserInsertAutoActivateHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.user.insert.autoActivate = action.payload;
}

const AdminConfigSlice = createSlice({
  name: 'admin.config',
  initialState: DefaultAdminConfigState,
  reducers: {
    /* ----------------- USER CONFIG ----------------- */
    adminConfigUserOpened: ConfigUserOpenedHandler,
    adminConfigUserInsertAutoActivate: ConfigUserInsertAutoActivateHandler,
    adminConfigUserListMaxDisplay: ConfigUserListMaxDisplayHandler,
    adminConfigUserListMaxLoadMore: ConfigUserListMaxLoadMoreHandler,
    adminConfigUserListMaxSearchDisplay: ConfigUserListMaxSearchDisplayHandler,
    adminConfigUserListShortByNew: ConfigUserListShortByNewHandler,
    adminConfigUserListDisplay: ConfigUserListDisplayHandler,
    adminConfigUserListReady: ConfigUserListReadyHandler,

    /* ----------------- ADMIN CONFIG ----------------- */
    adminConfigAdminOpened: ConfigAdminOpenedHandler,
    adminConfigAdminListMaxDisplay: ConfigAdminListMaxDisplayHandler,
    adminConfigAdminListMaxLoadMore: ConfigAdminListMaxLoadMoreHandler,
    adminConfigAdminListMaxSearchDisplay:
      ConfigAdminListMaxSearchDisplayHandler,
    adminConfigAdminListShortByNew: ConfigAdminListShortByNewHandler,
    adminConfigAdminListDisplay: ConfigAdminListDisplayHandler,
    adminConfigAdminListReady: ConfigAdminListReadyHandler,
  },
});

export const {
  /* ----------------- USER CONFIG ----------------- */
  adminConfigUserOpened,
  adminConfigUserInsertAutoActivate,
  adminConfigUserListMaxDisplay,
  adminConfigUserListMaxLoadMore,
  adminConfigUserListMaxSearchDisplay,
  adminConfigUserListShortByNew,
  adminConfigUserListDisplay,
  adminConfigUserListReady,

  /* ----------------- ADMIN CONFIG ----------------- */
  adminConfigAdminOpened,
  adminConfigAdminListMaxDisplay,
  adminConfigAdminListMaxLoadMore,
  adminConfigAdminListMaxSearchDisplay,
  adminConfigAdminListShortByNew,
  adminConfigAdminListDisplay,
  adminConfigAdminListReady,
} = AdminConfigSlice.actions;
export default AdminConfigSlice.reducer;
