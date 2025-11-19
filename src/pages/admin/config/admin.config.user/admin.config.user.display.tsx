import {
  AdminConfigUserListDisplayItems,
  adminConfigUserListDisplay,
} from '../../../../libs/redux/reducers/admin/admin.config.slice';
import type { RootState } from '../../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserConfig } from '.';
import { getAdminConfig } from '..';

export default function AdminConfigUserDisplay() {
  const state = useSelector((state: RootState) => state.admin_config.user);
  const dispatch = useDispatch();

  return (
    <div className="Admin-Config-User-Data">
      <p className="Admin-Config-User-Data-Label">Tampilkan</p>
      <select
        name="active"
        defaultValue={state.list.display}
        onChange={({ target }) => {
          dispatch(adminConfigUserListDisplay(parseInt(target.value)));

          // User > list > display | Update localstorage
          const userConfig: any = getAdminConfig('user');
          updateUserConfig({
            list: {
              ...userConfig.list,
              display: parseInt(target.value),
            },
          });
        }}
      >
        {AdminConfigUserListDisplayItems.map((itm, itmx) => (
          <option key={itmx} value={itm.value}>
            {itm.label}
          </option>
        ))}
      </select>
    </div>
  );
}
