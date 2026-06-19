import { json, publicUser, requireAuth } from '../../_lib/auth.js';

export async function onRequestGet(context) {
  const auth = await requireAuth(context);
  if (auth.response) return auth.response;
  return json({ user: publicUser(auth.user) });
}
