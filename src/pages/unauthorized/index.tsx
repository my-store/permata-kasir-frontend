import { rootRemoveLoading } from '../../libs/redux/reducers/root.slice';
import './styles/unauthorized.styles.main.scss';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

export default function Unauthorized() {
  const dispatch = useDispatch();

  function load() {
    // Remove loading animation after 3 second
    setTimeout(() => dispatch(rootRemoveLoading()), 3000);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="Unauthorized">
      <p className="Title">Unauthorized</p>
      <p className="Subtitle">You don't have permission!</p>
      <p className="Footer">
        &copy; {new Date().getFullYear()} Permata Komputer Brebes
        <br />
        (+62) 823-2438-0852
      </p>
    </div>
  );
}
