const API = (p) => `/api${p}`;
const setToken = (t) => localStorage.setItem('token', t);
const getToken = () => localStorage.getItem('token');

async function req(path, opts = {}) {
  const isForm = opts.body instanceof FormData;
  const headers = isForm ? {} : { 'Content-Type':'application/json' };
  const t = getToken(); if (t) headers.Authorization = `Bearer ${t}`;
  const res = await fetch(API(path), { ...opts, headers: { ...headers, ...(opts.headers||{}) } });
  const json = await res.json().catch(()=> ({}));
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json;
}

export const Auth = {
  signup: (body) => req('/auth/signup', { method:'POST', body: JSON.stringify(body) }),
  login:  (body) => req('/auth/login',  { method:'POST', body: JSON.stringify(body) }).then(d => { setToken(d.token); return d; }),
  logout: () => { localStorage.removeItem('token'); return req('/auth/logout', { method:'POST' }); },
  me:     () => req('/profile/me')
};

export const Profile = {
  get: (id) => id==='me' ? Auth.me() : req(`/profile/${id}`),
  updateMe: (patch) => req('/profile/me', { method:'PATCH', body: JSON.stringify(patch) }),
  deleteMe: () => req('/profile/me', { method:'DELETE' }),
  search: (q) => req(`/profile?q=${encodeURIComponent(q)}`)
};

export const Projects = {
  listMine: () => req('/projects'),
  create: (body) => req('/projects', { method:'POST', body: JSON.stringify(body) }),
  get: (id) => req(`/projects/${id}`),
  update: (id, patch) => req(`/projects/${id}`, { method:'PATCH', body: JSON.stringify(patch) }),
  remove: (id) => req(`/projects/${id}`, { method:'DELETE' }),
  addMember: (id, userId) => req(`/projects/${id}/members`, { method:'POST', body: JSON.stringify({ userId }) }),
  checkout: (id) => req(`/projects/${id}/checkout`, { method:'POST' }),
  checkin: (id, message) => req(`/projects/${id}/checkin`, { method:'POST', body: JSON.stringify({ message }) }),
  checkins: (id) => req(`/projects/${id}/checkins`)
};

export const Friends = {
  send: (toUserId) => req('/friends/requests', { method:'POST', body: JSON.stringify({ toUserId }) }),
  accept: (requestId) => req(`/friends/requests/${requestId}/accept`, { method:'POST' }),
  reject: (requestId) => req(`/friends/requests/${requestId}/reject`, { method:'POST' }),
  unfriend: (userId) => req(`/friends/${userId}`, { method:'DELETE' })
};

export const Feed = {
  global: () => req('/feed/global'),
  local:  () => req('/feed/local')
};

export const Search = {
  users: (q) => Profile.search(q),
  projects: (q) => req(`/projects/search?q=${encodeURIComponent(q)}`)
};
