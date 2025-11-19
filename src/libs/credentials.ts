import { JSONGet, JSONPost } from './requests';
import { Error, Log, Warn } from './console';

export const cred_name: string = 'UPK.Login.Credentials';

export function setLoginCredentials(data: any): void {
  // Dispay progress message
  Log('Save login credentials');

  localStorage.setItem(cred_name, JSON.stringify(data));
}

export function getLoginCredentials(): any {
  // Dispay progress message
  Log('Find login credentials');

  // Login data exist
  let jsonData: any = localStorage.getItem(cred_name);
  if (jsonData) {
    try {
      jsonData = JSON.parse(jsonData);
    } catch {
      // Dispay error message
      Error('Failed to parse login credentials');
    }
  }

  // No login data is founded
  else {
    // Display warning message
    Warn('No login credentials found');
  }

  return jsonData;
}

export function removeLoginCredentials(): void {
  localStorage.removeItem(cred_name);
}

export async function getUserData(tlp: string, loginToken: any): Promise<any> {
  // Dispay progress message
  Log('Find user data');

  let userData: any = null;
  const getProfileURL: string = `/api/${loginToken.role.toLowerCase()}/${tlp}`;

  try {
    const getUser = await JSONGet(getProfileURL, {
      headers: { Authorization: `Bearer ${loginToken.access_token}` },
    });
    // User data response is not valid (maybe token expired or something)
    if (
      !getUser.nama ||
      !getUser.tlp ||
      !getUser.foto ||
      !getUser.createdAt ||
      !getUser.updatedAt
    ) {
      // Dispay warning message
      Warn('Failed to get user data');
    }

    // User data is fetched
    else {
      // Ambil hanya nama, tlp, foto, createdAt dan updatedAt saja
      userData = {
        nama: getUser.nama,
        tlp: getUser.tlp,
        foto: getUser.foto,
        createdAt: getUser.createdAt,
        updatedAt: getUser.updatedAt,
      };
    }
  } catch (error) {
    // Dispay error message
    Error('Failed to get user data');
  }

  return userData;
}

export async function getAuthProfile(access_token: string): Promise<any> {
  // Dispay progress message
  Log('Get auth profile');

  let profile: any = null;
  try {
    // Melakukan pengecekan ke server apakah token masih aktif
    const getProfile = await JSONGet('/api/auth', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const { iat, exp, sub, role } = getProfile;
    // Jika token expired, response dari server adalah:
    // message dan statusCode.
    // message = Unauthorized
    // statusCode = 401
    // ----------------------------------------------------
    // Namun jika token masih aktif, response server adalah:
    // [iat, exp, sub, role]
    // iat = Issued At (where the token is created)
    // exp = Expired
    // sub = No Tlp. User/Admin/Kasir
    // role = User/Admin/Kasir
    if (!iat || !exp || !sub || !role) {
      // Dispay warning message
      Warn('Failed to get auth profile');
      Warn('Expected response: \n 1. iat \n 2. exp \n 3. sub \n 4. role');
    }

    // Auth profile is presented
    else {
      profile = getProfile;
    }
  } catch {
    // Dispay error message
    Error('Failed to get auth profile');
  }

  return profile;
}

export async function refreshToken(tlp: string): Promise<boolean> {
  // Dispay progress message
  Log('Refreshing token');

  let tokenRefreshed: any = false;
  try {
    // Melakukan permintaan ke server untuk dibuatkan token baru
    const refreshedToken = await JSONPost('/api/auth/refresh', {
      body: JSON.stringify({ tlp }),
    });
    // Jika refresh token berhasil dibuat, maka response darai server
    // adalah sama dengan ketika login yaitu berisi:
    // access_token dan role
    // access_token yang akan digunakan pada headers.Authorization
    // role = Admin, Kasir atau User, ini server yang menentukan saat proses login
    // server akan mencari tahu siapa yang sedang login.

    // Permintaan token baru ditolak atau terjadi error pada server
    if (!refreshedToken.access_token || !refreshedToken.role) {
      // Dispay warning message
      Warn('Token refresh failed');
      Warn('Expected response: \n 1. access_token \n 2. role');
    }

    // Token is refreshsed
    else {
      // Get user data
      const userData = await getUserData(tlp, refreshedToken);

      // No user data is found
      if (!userData) {
        // Dispay error message
        Error('Token refresh failed');
      }

      //   Token refresh success
      else {
        const newToken = { ...refreshedToken, data: userData };
        // Update credentials on local storage
        await setLoginCredentials(newToken);

        /*
        | Token sudah expired, namun berhasil mendapatkan token baru
        | Step selanjutnya adalah membuka halaman default sesuai role:
        | Admin | User | Kasir
        */
        tokenRefreshed = true;
      }
    }
  } catch {
    // Dispay error message
    Error('Token refresh failed');
  }

  // Dispay progress message
  Log('Token refresh succeeded');

  return tokenRefreshed;
}
