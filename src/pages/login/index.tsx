import { openAlert } from '../../libs/redux/reducers/components.alert.slice';
import type { RootState } from '../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, type CSSProperties } from 'react';
import { JSONPost } from '../../libs/requests';
import { Navigate } from 'react-router-dom';

import {
  rootRemoveLoading,
  rootOpenLoading,
} from '../../libs/redux/reducers/root.slice';

import {
  finishWaitLogin,
  setLoginReady,
  updateBgUrl,
  waitLogin,
  login,
} from '../../libs/redux/reducers/login.slice';
import { Log, Warn } from '../../libs/console';
import { findParams } from '../../libs/url';
import './styles/login.styles.main.scss';
import { serverUrl } from '../../App';
import {
  setLoginCredentials,
  getUserData,
  getLoginCredentials,
  getAuthProfile,
  refreshToken,
} from '../../libs/credentials';
import $ from 'jquery';

export default function Login() {
  const loginState = useSelector((state: RootState) => state.login);
  const { loginWait, loginBgUrl } = loginState;

  const dispatch = useDispatch();

  const errorAudioURL: string = `${serverUrl}/static/sounds/error.mp3`;
  const errorSound: HTMLAudioElement = new Audio(errorAudioURL);

  // Background image, remove loading only when background is loaded
  const bgUrl: string = `${serverUrl}/static/img/company-team.jpeg`;

  function failed(msg: string): void {
    // Play error sound
    errorSound.play();

    // Show alert box
    dispatch(
      openAlert({
        type: 'Error',
        title: 'Gagal Masuk',
        body: msg,
      }),
    );

    // Close from login-wait state
    dispatch(finishWaitLogin());
  }

  async function prepareLogin() {
    // Block if already wating for login
    if (loginWait) return;

    // Set login wait
    dispatch(waitLogin());

    const tlp: any = $('.login #tlp').val();
    const pass: any = $('.login #pass').val();

    // No data is presented
    if (tlp.length < 1 || pass.length < 1) {
      // Terminate task
      return failed('Mohon isi seluruh data');
    }

    // Persiapan login
    try {
      const tryLogin = await JSONPost('/api/auth', {
        body: JSON.stringify({ tlp, pass }),
      });
      // ---------------------------------------------------------------------------
      // JIKA DATA LOGIN BENAR
      // ---------------------------------------------------------------------------
      // Maka response yang diberikan server yaitu:
      // access_token dan role
      // access_token yang akan digunakan pada headers.Authorization
      // role = Admin atau User, ini server yang menentukan saat proses login
      // server akan mencari tahu siapa yang sedang login.

      // Tlp atau password salah, atau mungkin akun di banned
      if (tryLogin.message) {
        // Terminate task
        return failed(tryLogin.message);
      }

      // Get login profile
      const userData = await getUserData(tlp, tryLogin);

      // No user data is founded
      if (!userData) {
        // Terminate task and display the error message
        return failed('Data user tidak ditemukan');
      }

      Log('Login success!');

      // Create login credentials on local storage
      const loginData = { ...tryLogin, data: userData };
      setLoginCredentials(loginData);

      // Re-open loading animation
      Log('Re-open loading animation');
      dispatch(rootOpenLoading());

      // Set login data
      Log('Set is-login & login-role state');
      dispatch(login(tryLogin.role));

      // Close from login-wait state
      Log('Reset login-wait state');
      dispatch(finishWaitLogin());

      // Reset ready state
      Log('Reset login-ready state');
      dispatch(setLoginReady(false));
    } catch (error) {
      // Terminate task
      return failed(`${error}`);
    }
  }

  function redirect(role: string) {
    Log(`Redirecting to /${role.toLowerCase()} page`);
    return dispatch(login(role));
  }

  function load() {
    // Wait background image is fully loaded,
    // then remove loading.
    const bg = new Image();
    bg.onload = async () => {
      // Update background URL state
      Log('Update login background');
      dispatch(updateBgUrl(bgUrl));

      // Login token checking ...
      const savedCred = getLoginCredentials();
      // Login data is founded in local storage
      if (savedCred) {
        // Check login-profile
        const profile = await getAuthProfile(savedCred.access_token);

        // Token still active
        if (profile) {
          // Terminate process, and force to open landing page (admin | user)
          return redirect(savedCred.role);
        }

        // Token expired
        else {
          Warn('Token expired');

          // Refresh token
          const tokenRefreshed = await refreshToken(savedCred.data.tlp);

          // Token is refreshed
          if (tokenRefreshed) {
            // Ambil token yang barusaja direfresh
            // Metode ini dilakukan untuk mengantisipasi jika data
            // yang tadinya user berubah menjadi admin atau sebaliknya.
            // Jadi ambil role terbaru berdasarkan yang diberikan oleh /auth.
            const newToken = getLoginCredentials();

            // Terminate process, and force to open landing page (admin | user)
            return redirect(newToken.role);
          }
        }
      }

      // Everything's ok
      dispatch(setLoginReady(true));

      // Dispaly progress message
      Log('Login page is ready!');

      // Remove loading animation after 3 second
      setTimeout(() => dispatch(rootRemoveLoading()), 3000);
    };
    bg.src = bgUrl;
  }

  useEffect(() => {
    load();
  }, []);

  // Still not ready (isReady=false), but isLogin=true,
  // redirect to landing page (admin | user) and also deep URL/ sub url:
  // Example: /admin/sub-url/?and-other-parameters
  if (loginState.isLogin) {
    const urlRole = loginState.loginRole.toLowerCase();
    let landing_url: string = `/${urlRole}`;
    // Redirect\ deep URL is presented
    const redirect: string = findParams('redirect');
    if (redirect.length > 0 && redirect != '/') {
      // Only if redirect URL (root) is match with the role,
      // If not, keep landing_url as default (redirect to current role)
      const redMatch = new RegExp(urlRole, 'g').test(urlRole);
      if (redMatch) {
        // Continue with requested/ redirect URL
        landing_url = redirect;
      }
    }
    return <Navigate to={landing_url} replace />;
  }

  // Wait logic to finish (both signed-in or not)
  if (!loginState.isReady) return null;

  const DynamicStyles: CSSProperties = {
    backgroundImage: `url(${loginBgUrl})`,
  };

  return (
    <div className="login" style={DynamicStyles}>
      <div className="login-box-container">
        <div className="login-box">
          <div className="login-form-container">
            <div className="login-form-header">
              <p className="login-form-title">Masuk Dulu</p>
            </div>
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
              <div className="login-form-group">
                <label>No. Tlp</label>
                <input type="text" id="tlp" />
              </div>
              <div className="login-form-group">
                <label>Password</label>
                <input type="password" id="pass" />
              </div>
              {/* Form buttons */}
              <div className="login-form-buttons">
                <button
                  className="login-form-button-submit"
                  onClick={prepareLogin}
                >
                  Masuk
                </button>
              </div>

              {/* Forgot password */}
              <p className="forgot-password-text">
                Lupa password?{' '}
                <span className="forgot-password-link">Ubah</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
