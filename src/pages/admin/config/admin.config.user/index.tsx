import {
  adminConfigUserListMaxSearchDisplay,
  adminConfigUserInsertAutoActivate,
  adminConfigUserListMaxLoadMore,
  adminConfigUserListMaxDisplay,
  adminConfigUserListShortByNew,
  adminConfigUserListDisplay,
  adminConfigUserListReady,
  type UserConfigInterface,
  adminConfigUserOpened,
} from '../../../../libs/redux/reducers/admin/admin.config.slice';
import AdminConfigUserInsertAutoActivate from './admin.config.user.insert.autoActivate';
import AdminConfigUserMaxSearchDisplay from './admin.config.user.maxSearchDisplay';
import AdminConfigUserShortByNew from './admin.config.user.shortByNew';
import AdminConfigUserMaxDisplay from './admin.config.user.maxDisplay';
import AdminConfigUserLoadMore from './admin.config.user.loadMore';
import AdminConfigUserDisplay from './admin.config.user.display';
import type { RootState } from '../../../../libs/redux/store';
import { createAdminConfig, getAdminConfig } from '..';
import type { AdminGlobalStyleInterface } from '../..';
import { useDispatch, useSelector } from 'react-redux';
import './styles/admin.config.user.styles.main.scss';
import { MdClose } from 'react-icons/md';
import { useEffect } from 'react';

export function updateUserConfig(newConfig: any) {
  const oldConfig: any = getAdminConfig();
  createAdminConfig({
    ...oldConfig,
    user: {
      ...oldConfig.user,
      ...newConfig,
    },
  });
}

interface AdminConfigUserPropsInterface {
  globalStyle: AdminGlobalStyleInterface;
}

export default function AdminConfigUser(props: AdminConfigUserPropsInterface) {
  const state = useSelector((state: RootState) => state.admin_config.user);
  const dispatch = useDispatch();
  const { globalStyle } = props;

  function applyConfig() {
    const userConfig: UserConfigInterface = getAdminConfig('user');

    // List > display
    const { display } = userConfig.list;
    dispatch(adminConfigUserListDisplay(display));
    // List > maxDisplay
    const { maxDisplay } = userConfig.list;
    dispatch(adminConfigUserListMaxDisplay(maxDisplay));
    // List > maxLoadMore
    const { maxLoadMore } = userConfig.list;
    dispatch(adminConfigUserListMaxLoadMore(maxLoadMore));
    // List > maxSearchDisplay
    const { maxSearchDisplay } = userConfig.list;
    dispatch(adminConfigUserListMaxSearchDisplay(maxSearchDisplay));
    // List > shortByNew
    const { shortByNew } = userConfig.list;
    dispatch(adminConfigUserListShortByNew(shortByNew));

    // Insert
    const { autoActivate } = userConfig.insert;
    dispatch(adminConfigUserInsertAutoActivate(autoActivate));

    // Set ready state
    dispatch(adminConfigUserListReady(true));
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
          ? 'Admin-Config-User Admin-Config-User-Active'
          : 'Admin-Config-User'
      }
    >
      <div
        className="Admin-Config-User-Header"
        style={{ backgroundColor: globalStyle.primaryColor }}
      >
        <h4 className="Admin-Config-User-Header-Text">Pengaturan</h4>
        <div
          className="Admin-Config-User-Header-Close-Button"
          onClick={() => dispatch(adminConfigUserOpened(false))}
        >
          <MdClose />
        </div>
      </div>
      <div className="Admin-Config-User-Body">
        <AdminConfigUserDisplay />
        <AdminConfigUserMaxDisplay />
        <AdminConfigUserLoadMore />
        <AdminConfigUserMaxSearchDisplay />
        <AdminConfigUserShortByNew />
        <AdminConfigUserInsertAutoActivate />
      </div>
    </div>
  );
}
