import auth from '../utils/auth';

const apiHost = window.location.href.includes('localhost') ? 'http://localhost:3002/api' : 'http://api.codingcoach.io/';
let currentUser;

export async function makeApiCall(path, body, method) {
  const url = `${apiHost}${path}`;
  const options = {
    mode: 'cors',
    method,
    body: body && JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${auth.getIdToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
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
  if (!currentUser) {
    currentUser = await makeApiCall('/users/current').then(res => res.data);
  }
  return currentUser;
}

export async function getMentors() {
  const res = await makeApiCall('/mentors');
  return res.data;
}

export async function updateMentor(mentor) {
  const res = await makeApiCall(`/users/${mentor.id}`, mentor, 'PUT');
  return res.success;
}

export async function deleteMentor(mentor) {
  const res = await makeApiCall(`/users/${mentor.id}`, null, 'DELETE');
  return res.success;
}