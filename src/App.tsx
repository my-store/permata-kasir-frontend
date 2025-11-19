import { getLoginCredentials } from './libs/credentials';
import type { RootState } from './libs/redux/store';
import { FirstLoading } from './components/loading';
import { io, type Socket } from 'socket.io-client';
import Unauthorized from './pages/unauthorized';
import { useSelector } from 'react-redux';
import NotFound from './pages/not-found';
import { findDeepUrl } from './libs/url';
import AdminRoutes from './pages/admin';
import Alert from './components/alert';
import UserRoutes from './pages/user';
import { Log } from './libs/console';
import Login from './pages/login';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Routes,
  Route,
} from 'react-router-dom';
import './App.scss';

export interface ProtectedLayoutInterface {
  role: string;
}

// Server URL configuration must be matched with api/.env file
export const serverUrl: string = 'http://localhost:5000';

export let socket: Socket;

/* -------------------------------------------------------------
|  PROTECTED ROUTE
|  -------------------------------------------------------------
*/
function ProtectedRoutes({ role }: ProtectedLayoutInterface) {
  const loginState = useSelector((state: RootState) => state.login);

  // Not signed-in, redirect to login page
  const deepUrl: string = findDeepUrl();
  if (!loginState.isLogin)
    return <Navigate to={`/?redirect=${deepUrl}`} replace />;

  // Unauthorized, signed-in but requested URL is not match with its login role
  const unauthorized_url: string = '/unauthorized';
  if (loginState.loginRole != role)
    return <Navigate to={unauthorized_url} replace />;

  // Display page for (admin | kasir | user)
  return <Outlet />;
}

export default function App() {
  const rootState = useSelector((state: RootState) => state.root);
  const alertState = useSelector((state: RootState) => state.component_alert);

  function socketConnect(callback: Function) {
    socket = io(serverUrl);
    /*
    | -----------------------------------------------------------------------
    | WHEN I'AM IS CONNECTED TO SOCKET SERVER
    | -----------------------------------------------------------------------
    | Get my login data in local-storage and sent to server for broadcast
    | The last step is inside socket connected listener.
    | -----------------------------------------------------------------------
    | NOTE:
    | Set login state first before set ready, only if token is still active
    | if not, will force redirect to login page, because default value
    | of 'isLogin' is false.
    | If not connected to the server will never redirected.
    */
    socket.on('connect', () => {
      Log('Socket is now connected');

      // Broadcast to other, that i'm is online now
      const { role, data } = getLoginCredentials();
      socket.emit('online', { tlp: data.tlp, role });

      // Return the next logic to callback
      callback();
    });

    // When socket is disconected
    socket.on('disconnect', () => {
      Error('Socket disconnected');
    });
  }

  return (
    <BrowserRouter>
      <div className="App">
        {/* Loading animation */}
        {rootState.isLoading && <FirstLoading easing="ease-in-out" />}

        {/* Alert box */}
        {alertState.opened && <Alert />}

        <Routes>
          {/* Landing page | Logic */}
          <Route path="/" element={<Login />} />

          {/* Unauthorized */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin routes */}
          <Route element={<ProtectedRoutes role="Admin" />}>
            {AdminRoutes.map((adm, admx) => (
              <Route
                key={admx}
                path={adm.path}
                element={adm.element({ socketConnect })}
              />
            ))}
          </Route>

          {/* User routes */}
          <Route element={<ProtectedRoutes role="User" />}>
            {UserRoutes.map((usr, usrx) => (
              <Route
                key={usrx}
                path={usr.path}
                element={usr.element({ socketConnect })}
              />
            ))}
          </Route>

          {/* Catch all | Not found page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
