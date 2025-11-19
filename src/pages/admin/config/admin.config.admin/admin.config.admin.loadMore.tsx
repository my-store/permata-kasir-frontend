import { adminConfigAdminListMaxLoadMore } from '../../../../libs/redux/reducers/admin/admin.config.slice';
import type { RootState } from '../../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateAdminConfig } from '.';
import { getAdminConfig } from '..';

export default function AdminConfigAdminLoadMore() {
  const state = useSelector((state: RootState) => state.admin_config.admin);
  const dispatch = useDispatch();

  return (
    <div className="Admin-Config-Admin-Data">
      <p className="Admin-Config-Admin-Data-Label">Tampilkan Selanjutnya</p>
      <input
        type="number"
        // value={state.list.maxLoadMore}
        defaultValue={state.list.maxLoadMore}
        onChange={({ target }) => {
          dispatch(adminConfigAdminListMaxLoadMore(parseInt(target.value)));

          // Admin > list > maxLoadMore | Update localstorage
          const adminConfig: any = getAdminConfig('admin');
          updateAdminConfig({
            list: {
              ...adminConfig.list,
              maxLoadMore: parseInt(target.value),
            },
          });
        }}
      />
    </div>
  );
}
