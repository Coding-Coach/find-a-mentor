import auth from '../utils/auth';

const apiHost = window.location.href.includes('localhost') ? 'http://localhost:3002/api' : 'http://api.codingcoach.io/users';

async function makeApiCall(path, body, method) {
  const url = `${apiHost}${path}`;
  const options = {
    mode: 'cors',
    method,
    body: body && JSON.stringify(body),
    headers: {
      'Authorization': `Bearer ${auth.getIdToken()}`
    }
  };
  const data = await fetch(url, options);
  try {
    return await data.json();
  } catch (error) {
    return await data.text();
  }
}

export async function getCurrentUser() {
  const res = await makeApiCall('/current');
  return res.user;
}

export async function getMentors() {
  const res = await makeApiCall('/');
  return res.users;
}