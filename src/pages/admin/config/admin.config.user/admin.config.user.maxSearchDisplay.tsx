import { adminConfigUserListMaxSearchDisplay } from '../../../../libs/redux/reducers/admin/admin.config.slice';
import type { RootState } from '../../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserConfig } from '.';
import { getAdminConfig } from '..';

export default function AdminConfigUserMaxSearchDisplay() {
  const state = useSelector((state: RootState) => state.admin_config.user);
  const dispatch = useDispatch();
  return (
    <div className="Admin-Config-User-Data">
      <p className="Admin-Config-User-Data-Label">Tampilkan Hasil Pencarian</p>
      <input
        type="number"
        // value={state.list.maxSearchDisplay}
        defaultValue={state.list.maxSearchDisplay}
        onChange={({ target }) => {
          dispatch(adminConfigUserListMaxSearchDisplay(parseInt(target.value)));

          // User > list > maxSearchDisplay | Update localstorage
          const userConfig: any = getAdminConfig('user');
          updateUserConfig({
            list: {
              ...userConfig.list,
              maxSearchDisplay: parseInt(target.value),
            },
          });
        }}
      />
    </div>
  );
}
