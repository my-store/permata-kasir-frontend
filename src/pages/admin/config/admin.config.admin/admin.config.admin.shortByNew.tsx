import { adminConfigAdminListShortByNew } from '../../../../libs/redux/reducers/admin/admin.config.slice';
import type { RootState } from '../../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateAdminConfig } from '.';
import { getAdminConfig } from '..';

export default function AdminConfigAdminShortByNew() {
  const state = useSelector((state: RootState) => state.admin_config.admin);
  const dispatch = useDispatch();

  return (
    <div className="Admin-Config-Admin-Data">
      <p className="Admin-Config-Admin-Data-Label">
        Tampilkan Dari Data Terbaru
      </p>
      <input
        type="checkbox"
        // defaultChecked={state.list.shortByNew}
        checked={state.list.shortByNew}
        onChange={({ target: { checked } }) => {
          dispatch(adminConfigAdminListShortByNew(checked));

          // Admin > list > shortByNew | Update localstorage
          const adminConfig: any = getAdminConfig('admin');
          updateAdminConfig({
            list: {
              ...adminConfig.list,
              shortByNew: checked,
            },
          });
        }}
      />
    </div>
  );
}
