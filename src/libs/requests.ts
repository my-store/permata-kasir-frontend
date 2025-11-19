const DefaultHeaders: any = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': 'true',
  Connection: 'keep-alive',
  'Keep-Alive': 'timeout=5',
};

export async function JSONGet(
  url: string,
  options?: RequestInit,
): Promise<any> {
  const req = await fetch(url, {
    headers: {
      ...DefaultHeaders,
      ...options?.headers,
    },
  });
  const res = await req.json();
  return res;
}

export async function JSONPatch(
  url: string,
  options?: RequestInit,
): Promise<any> {
  const req = await fetch(url, {
    method: 'PATCH',
    headers: {
      ...DefaultHeaders,
      ...options?.headers,
    },
    body: options?.body,
  });
  const res = await req.json();
  return res;
}

export async function JSONPost(
  url: string,
  options?: RequestInit,
): Promise<any> {
  const req = await fetch(url, {
    method: 'POST',
    headers: {
      ...DefaultHeaders,
      ...options?.headers,
    },
    body: options?.body,
  });
  const res = await req.json();
  return res;
}

export async function FormPost(
  url: string,
  options?: RequestInit,
): Promise<any> {
  const req = await fetch(url, {
    method: 'POST',
    headers: {
      // In react (browser app) is not need headers, but on other app like react-native is needed.

      // Add new or override default headers (by user)
      ...options?.headers,
    },
    body: options?.body,
  });
  const res = await req.json();
  return res;
}

export async function FormPatch(
  url: string,
  options?: RequestInit,
): Promise<any> {
  const req = await fetch(url, {
    method: 'PATCH',
    headers: {
      // In react (browser app) is not need headers, but on other app like react-native is needed.

      // Add new or override default headers (by user)
      ...options?.headers,
    },
    body: options?.body,
  });
  const res = await req.json();
  return res;
}
