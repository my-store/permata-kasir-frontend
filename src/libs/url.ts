export function findParams(query: string = ''): string {
  const getParams: any = window.location.search;

  // No query presented, return whole parameters
  if (query.length < 1) return getParams;

  /* -------------------------------------------------------------
  |  URL PARAMETER FINDER
  |  -------------------------------------------------------------
  |  Query must be presented !
  */
  let result: string = '';

  // Pastikan parameter dengan format yang benar (mengandung ?)
  if (/\?/.test(getParams)) {
    const params = getParams.split('?').pop().split('&');
    for (let p of params) {
      // Pastikan parameter mengandung =
      if (/\=/.test(p)) {
        const [key, val] = p.split('=');
        if (key == query) {
          result = val;
        }
      }
    }
  }

  return result;
}

export function findDeepUrl(): any {
  const full_url: string = window.location.href;
  const root_url: string = window.location.origin;
  return full_url.split(root_url).pop();
}
