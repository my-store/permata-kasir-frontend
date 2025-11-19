import { adminConfigUserListMaxDisplay } from '../../../../libs/redux/reducers/admin/admin.config.slice';
import type { RootState } from '../../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserConfig } from '.';
import { getAdminConfig } from '..';

export default function AdminConfigUserMaxDisplay() {
  const state = useSelector((state: RootState) => state.admin_config.user);
  const dispatch = useDispatch();

  return (
    <div className="Admin-Config-User-Data">
      <p className="Admin-Config-User-Data-Label">Jumlah Tampilan</p>
      <input
        type="number"
        // value={state.list.maxDisplay}
        defaultValue={state.list.maxDisplay}
        onChange={({ target }) => {
          dispatch(adminConfigUserListMaxDisplay(parseInt(target.value)));

          // User > list > maxDisplay | Update localstorage
          const userConfig: any = getAdminConfig('user');
          updateUserConfig({
            list: {
              ...userConfig.list,
              maxDisplay: parseInt(target.value),
            },
          });
        }}
      />
    </div>
  );
}
