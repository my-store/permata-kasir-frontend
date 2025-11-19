import { adminConfigUserListMaxLoadMore } from '../../../../libs/redux/reducers/admin/admin.config.slice';
import type { RootState } from '../../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserConfig } from '.';
import { getAdminConfig } from '..';

export default function AdminConfigUserLoadMore() {
  const state = useSelector((state: RootState) => state.admin_config.user);
  const dispatch = useDispatch();

  return (
    <div className="Admin-Config-User-Data">
      <p className="Admin-Config-User-Data-Label">Tampilkan Selanjutnya</p>
      <input
        type="number"
        // value={state.list.maxLoadMore}
        defaultValue={state.list.maxLoadMore}
        onChange={({ target }) => {
          dispatch(adminConfigUserListMaxLoadMore(parseInt(target.value)));

          // User > list > maxLoadMore | Update localstorage
          const userConfig: any = getAdminConfig('user');
          updateUserConfig({
            list: {
              ...userConfig.list,
              maxLoadMore: parseInt(target.value),
            },
          });
        }}
      />
    </div>
  );
}
