import {
  AdminConfigAdminListDisplayItems,
  adminConfigAdminListDisplay,
} from '../../../../libs/redux/reducers/admin/admin.config.slice';
import type { RootState } from '../../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateAdminConfig } from '.';
import { getAdminConfig } from '..';

export default function AdminConfigAdminDisplay() {
  const state = useSelector((state: RootState) => state.admin_config.admin);
  const dispatch = useDispatch();

  return (
    <div className="Admin-Config-Admin-Data">
      <p className="Admin-Config-Admin-Data-Label">Tampilkan</p>
      <select
        name="active"
        defaultValue={state.list.display}
        onChange={({ target }) => {
          dispatch(adminConfigAdminListDisplay(parseInt(target.value)));

          // Admin > list > display | Update localstorage
          const adminConfig: any = getAdminConfig('admin');
          updateAdminConfig({
            list: {
              ...adminConfig.list,
              display: parseInt(target.value),
            },
          });
        }}
      >
        {AdminConfigAdminListDisplayItems.map((itm, itmx) => (
          <option key={itmx} value={itm.value}>
            {itm.label}
          </option>
        ))}
      </select>
    </div>
  );
}
