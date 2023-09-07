const makePost = (url: any, body: string, options = {} as any) => {
  const headers = options.headers || {};
  return fetch(url, { body, headers, method: 'POST' }).then(res => {
    if (res.statusText === 'No Content') {
      return res;
    }
    return res.json();
  });
};

const makeJSONPost = (
  url: any,
  data: {
    client_id?: string;
    client_secret?: string;
    audience?: string;
    grant_type?: string;
    data?: any;
  },
  options = {} as any
) => {
  const body = JSON.stringify(data);
  const headers = options.headers || {};
  headers['Content-Type'] = 'application/json';

  return makePost(url, body, { headers });
};

// eslint-disable-next-line import/prefer-default-export
export const postEmail = (data: any) => {
  const url = '/api/sendmail/';
  const headers = '';
  return makeJSONPost(url, data, { headers });
};
