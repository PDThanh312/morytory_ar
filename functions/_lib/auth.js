const encoder = new TextEncoder();
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
const PASSWORD_ITERATIONS = 120000;

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

export function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase();
}

export function userKey(email) {
  return `user_${normalizeEmail(email)}`;
}

export function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    return 'Mật khẩu phải có ít nhất 8 ký tự.';
  }
  if (password.length > 128) {
    return 'Mật khẩu không được dài quá 128 ký tự.';
  }
  return null;
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function bytesToBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function stringToBase64Url(value) {
  return bytesToBase64Url(encoder.encode(value));
}

function base64UrlToBytes(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function base64UrlToString(value) {
  return new TextDecoder().decode(base64UrlToBytes(value));
}

function randomBase64Url(length = 16) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

function getAuthSecret(env) {
  const secret = env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET chưa được cấu hình hoặc ngắn hơn 32 ký tự.');
  }
  return secret;
}

function configuredAdminEmails(env) {
  return new Set(
    String(env.ADMIN_EMAILS || '')
      .split(',')
      .map(normalizeEmail)
      .filter(Boolean),
  );
}

export function isConfiguredAdminEmail(email, env) {
  return configuredAdminEmails(env).has(normalizeEmail(email));
}

export function resolveRole(email, env, currentRole = 'user') {
  if (isConfiguredAdminEmail(email, env)) return 'admin';
  return currentRole === 'admin' ? 'admin' : 'user';
}


export async function hashPassword(password, salt = randomBase64Url(16)) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: base64UrlToBytes(salt),
      iterations: PASSWORD_ITERATIONS,
    },
    keyMaterial,
    256,
  );
  return { salt, hash: bytesToBase64Url(new Uint8Array(bits)) };
}

export async function verifyPassword(password, salt, expectedHash) {
  const { hash } = await hashPassword(password, salt);
  const actual = base64UrlToBytes(hash);
  const expected = base64UrlToBytes(expectedHash);
  if (actual.length !== expected.length) return false;

  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) {
    difference |= actual[index] ^ expected[index];
  }
  return difference === 0;
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(user, env) {
  const now = Math.floor(Date.now() / 1000);
  const header = stringToBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = stringToBase64Url(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: now,
      exp: now + SESSION_TTL_SECONDS,
    }),
  );
  const unsigned = `${header}.${payload}`;
  const signature = await sign(unsigned, getAuthSecret(env));
  return `${unsigned}.${signature}`;
}

export async function verifySessionToken(token, env) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const [header, payload, signature] = parts;
    const unsigned = `${header}.${payload}`;
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(getAuthSecret(env)),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlToBytes(signature),
      encoder.encode(unsigned),
    );
    if (!valid) return null;

    const claims = JSON.parse(base64UrlToString(payload));
    if (!claims.exp || claims.exp <= Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch {
    return null;
  }
}

export function getBearerToken(request) {
  const authorization = request.headers.get('Authorization') || '';
  const [scheme, token] = authorization.split(' ');
  return scheme === 'Bearer' ? token : null;
}

export async function authenticate(context) {
  const token = getBearerToken(context.request);
  const claims = await verifySessionToken(token, context.env);
  if (!claims) return null;

  const user = await context.env.MORYTORY_ORDERS.get(userKey(claims.email), 'json');
  if (!user || user.id !== claims.sub) return null;

  const role = resolveRole(user.email, context.env, user.role);
  if (role !== user.role) {
    user.role = role;
    user.updatedAt = new Date().toISOString();
    await context.env.MORYTORY_ORDERS.put(userKey(user.email), JSON.stringify(user));
  }
  return user;
}

export async function requireAuth(context, allowedRoles = ['user', 'admin']) {
  try {
    const user = await authenticate(context);
    if (!user) {
      return { response: json({ error: 'Bạn cần đăng nhập để tiếp tục.' }, 401) };
    }
    if (!allowedRoles.includes(user.role)) {
      return { response: json({ error: 'Bạn không có quyền thực hiện thao tác này.' }, 403) };
    }
    return { user };
  } catch (error) {
    return { response: json({ error: error.message }, 500) };
  }
}
