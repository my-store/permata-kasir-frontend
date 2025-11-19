import { removeAlert } from '../../libs/redux/reducers/components.alert.slice';
import type { RootState } from '../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import './styles/components.alert.styles.main.scss';

export default function Alert() {
  const alertState = useSelector((state: RootState) => state.component_alert);
  const dispatch = useDispatch();

  const { opened, type, title, body } = alertState;

  // Dynamic classes
  const containerClass = opened ? 'Alert Alert-Active' : 'Alert';
  const boxClass = opened
    ? `Alert-Box Alert-Box-Active ${type}`
    : `Alert-Box ${type}`;

  return (
    <div className={containerClass}>
      <div className={boxClass}>
        {/* Title */}
        <p className={`Alert-Title ${type}`}>{title}</p>

        {/* Body */}
        <p className="Alert-Body">{body}</p>

        {/* Button */}
        <div className="Alert-Button-Container">
          <button
            className="Alert-Close-Btn"
            onClick={() => dispatch(removeAlert())}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
