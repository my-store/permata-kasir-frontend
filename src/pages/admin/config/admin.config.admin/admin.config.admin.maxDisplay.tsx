import { adminConfigAdminListMaxDisplay } from '../../../../libs/redux/reducers/admin/admin.config.slice';
import type { RootState } from '../../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateAdminConfig } from '.';
import { getAdminConfig } from '..';

export default function AdminConfigAdminMaxDisplay() {
  const state = useSelector((state: RootState) => state.admin_config.admin);
  const dispatch = useDispatch();

  return (
    <div className="Admin-Config-Admin-Data">
      <p className="Admin-Config-Admin-Data-Label">Jumlah Tampilan</p>
      <input
        type="number"
        // value={state.list.maxDisplay}
        defaultValue={state.list.maxDisplay}
        onChange={({ target }) => {
          dispatch(adminConfigAdminListMaxDisplay(parseInt(target.value)));

          // Admin > list > maxDisplay | Update localstorage
          const adminConfig: any = getAdminConfig('admin');
          updateAdminConfig({
            list: {
              ...adminConfig.list,
              maxDisplay: parseInt(target.value),
            },
          });
        }}
      />
    </div>
  );
}
