import { rootRemoveLoading } from '../../libs/redux/reducers/root.slice';
import './styles/not-found.styles.main.scss';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

export default function NotFound() {
  const dispatch = useDispatch();

  function load() {
    // Remove loading animation after 3 second
    setTimeout(() => dispatch(rootRemoveLoading()), 3000);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="NotFound">
      <p className="Title">404</p>
      <p className="Subtitle">Page not found</p>
      <p className="Footer">
        &copy; {new Date().getFullYear()} Permata Komputer Brebes
        <br />
        (+62) 823-2438-0852
      </p>
    </div>
  );
}
