import './styles/components.socket-disconnected.styles.main.scss';
import type { RootState } from '../../libs/redux/store';
import { useSelector } from 'react-redux';

export default function SocketDisconnected() {
  // Socket state
  const connected = useSelector((state: RootState) => state.socket.connected);

  return (
    <div
      className={
        !connected
          ? 'socket-disconnected socket-disconnected-active'
          : 'socket-disconnected'
      }
    >
      <div
        className={
          !connected
            ? 'socket-disconnected-box socket-disconnected-box-active'
            : 'socket-disconnected-box'
        }
      >
        <div className="socket-disconnected-header">
          <p className="socket-disconnected-header-title">Server Offline</p>
        </div>
        <div className="socket-disconnected-body">
          <p className="socket-disconnected-body-message">
            Sambungan dengan server terputus, kemungkinan konfigurasi pada
            server telah berubah, segera menghubungi pengembang aplikasi.
          </p>
        </div>
      </div>
    </div>
  );
}
