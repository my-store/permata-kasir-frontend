import { adminConfigAdminListMaxSearchDisplay } from '../../../../libs/redux/reducers/admin/admin.config.slice';
import type { RootState } from '../../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateAdminConfig } from '.';
import { getAdminConfig } from '..';

export default function AdminConfigAdminMaxSearchDisplay() {
  const state = useSelector((state: RootState) => state.admin_config.admin);
  const dispatch = useDispatch();
  return (
    <div className="Admin-Config-Admin-Data">
      <p className="Admin-Config-Admin-Data-Label">Tampilkan Hasil Pencarian</p>
      <input
        type="number"
        // value={state.list.maxSearchDisplay}
        defaultValue={state.list.maxSearchDisplay}
        onChange={({ target }) => {
          dispatch(
            adminConfigAdminListMaxSearchDisplay(parseInt(target.value)),
          );

          // Admin > list > maxSearchDisplay | Update localstorage
          const adminConfig: any = getAdminConfig('admin');
          updateAdminConfig({
            list: {
              ...adminConfig.list,
              maxSearchDisplay: parseInt(target.value),
            },
          });
        }}
      />
    </div>
  );
}
