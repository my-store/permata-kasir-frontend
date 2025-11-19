import {
  adminConfigAdminListMaxSearchDisplay,
  adminConfigAdminListMaxLoadMore,
  adminConfigAdminListMaxDisplay,
  adminConfigAdminListShortByNew,
  adminConfigAdminListDisplay,
  adminConfigAdminListReady,
  type AdminConfigInterface,
  adminConfigAdminOpened,
} from '../../../../libs/redux/reducers/admin/admin.config.slice';
import AdminConfigAdminMaxSearchDisplay from './admin.config.admin.maxSearchDisplay';
import AdminConfigAdminShortByNew from './admin.config.admin.shortByNew';
import AdminConfigAdminMaxDisplay from './admin.config.admin.maxDisplay';
import AdminConfigAdminLoadMore from './admin.config.admin.loadMore';
import AdminConfigAdminDisplay from './admin.config.admin.display';
import type { RootState } from '../../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { createAdminConfig, getAdminConfig } from '..';
import type { AdminGlobalStyleInterface } from '../..';
import './styles/admin.config.admin.styles.main.scss';
import { MdClose } from 'react-icons/md';
import { useEffect } from 'react';

export function updateAdminConfig(newConfig: any) {
  const oldConfig: any = getAdminConfig();
  createAdminConfig({
    ...oldConfig,
    admin: {
      ...oldConfig.admin,
      ...newConfig,
    },
  });
}

interface AdminConfigAdminPropsInterface {
  globalStyle: AdminGlobalStyleInterface;
}

export default function AdminConfigAdmin(
  props: AdminConfigAdminPropsInterface,
) {
  const state = useSelector((state: RootState) => state.admin_config.admin);
  const dispatch = useDispatch();
  const { globalStyle } = props;

  function applyConfig() {
    const adminConfig: AdminConfigInterface = getAdminConfig('admin');

    // List > display
    const { display } = adminConfig.list;
    dispatch(adminConfigAdminListDisplay(display));
    // List > maxDisplay
    const { maxDisplay } = adminConfig.list;
    dispatch(adminConfigAdminListMaxDisplay(maxDisplay));
    // List > maxLoadMore
    const { maxLoadMore } = adminConfig.list;
    dispatch(adminConfigAdminListMaxLoadMore(maxLoadMore));
    // List > maxSearchDisplay
    const { maxSearchDisplay } = adminConfig.list;
    dispatch(adminConfigAdminListMaxSearchDisplay(maxSearchDisplay));
    // List > shortByNew
    const { shortByNew } = adminConfig.list;
    dispatch(adminConfigAdminListShortByNew(shortByNew));

    // Set ready state
    dispatch(adminConfigAdminListReady(true));
  }

  useEffect(() => {
    applyConfig();
  }, []);

  // Make sure everythings ready
  if (!state.list.ready) return null;

  return (
    <div
      className={
        state.opened
          ? 'Admin-Config-Admin Admin-Config-Admin-Active'
          : 'Admin-Config-Admin'
      }
    >
      <div
        className="Admin-Config-Admin-Header"
        style={{ backgroundColor: globalStyle.primaryColor }}
      >
        <h4 className="Admin-Config-Admin-Header-Text">Pengaturan</h4>
        <div
          className="Admin-Config-Admin-Header-Close-Button"
          onClick={() => dispatch(adminConfigAdminOpened(false))}
        >
          <MdClose />
        </div>
      </div>
      <div className="Admin-Config-Admin-Body">
        <AdminConfigAdminDisplay />
        <AdminConfigAdminMaxDisplay />
        <AdminConfigAdminLoadMore />
        <AdminConfigAdminMaxSearchDisplay />
        <AdminConfigAdminShortByNew />
      </div>
    </div>
  );
}
