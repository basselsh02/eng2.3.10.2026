// src/services/ffApi.js
// Read-only service layer for all calls to the FinalFinally backend.

const BASE_URL = import.meta.env.VITE_FF_API_URL || 'http://localhost:5000';
const FF_USERNAME = import.meta.env.VITE_FF_USERNAME || '';
const FF_PASSWORD = import.meta.env.VITE_FF_PASSWORD || '';

// In-memory token cache — valid for the duration of the browser session
let _cachedToken = null;

/**
 * Login to FinalFinally and cache the JWT token.
 */
const login = async () => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: FF_USERNAME, password: FF_PASSWORD }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`FF login failed: ${err.message || res.status}`);
  }
  const data = await res.json();
  _cachedToken = data.token;
  return _cachedToken;
};

/**
 * Returns cached token, logging in first if needed.
 */
const getToken = async () => {
  if (!_cachedToken) await login();
  return _cachedToken;
};

/**
 * Core fetch wrapper.
 * - Injects Authorization header
 * - Builds query string from params object
 * - On 401 (token expired), clears cache and retries once
 * - Throws on non-OK responses
 */
const ffFetch = async (path, params = {}, retried = false) => {
  const token = await getToken();
  const url = new URL(`${BASE_URL}${path}`);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v));
    }
  });

  const res = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 && !retried) {
    _cachedToken = null;
    return ffFetch(path, params, true);
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `FF API error ${res.status} on ${path}`);
  }

  return res.json();
};

// ─── Projects (مشاريع) ────────────────────────────────────────────────────────

/** Fetch all projects. Supports: page, limit, search, sortBy, sortOrder */
export const getFFProjects = (params = {}) =>
  ffFetch('/api/projects', { limit: 100, ...params });

/** Fetch a single project by MongoDB ObjectId string */
export const getFFProjectById = (id) =>
  ffFetch(`/api/projects/${id}`);

// ─── Companies (الشركات) ──────────────────────────────────────────────────────

/** Fetch all companies. Supports: page, limit, search, sortBy, sortOrder */
export const getFFCompanies = (params = {}) =>
  ffFetch('/api/companies', { limit: 100, ...params });

/** Fetch a single company by MongoDB ObjectId string */
export const getFFCompanyById = (id) =>
  ffFetch(`/api/companies/${id}`);

// ─── Contracts (عقود) ─────────────────────────────────────────────────────────

/** Fetch all contracts. Supports: page, limit, search, sortBy, sortOrder */
export const getFFContracts = (params = {}) =>
  ffFetch('/api/contracts', { limit: 100, ...params });

/** Fetch a single contract by MongoDB ObjectId string */
export const getFFContractById = (id) =>
  ffFetch(`/api/contracts/${id}`);

// ─── Extract Advances (مستخلصات) ──────────────────────────────────────────────

/** Fetch all extract advances. Supports: page, limit, search, searchField, sortBy, sortOrder */
export const getFFExtracts = (params = {}) =>
  ffFetch('/api/extract-advances', { limit: 100, ...params });

/** Fetch a single extract advance by MongoDB ObjectId string */
export const getFFExtractById = (id) =>
  ffFetch(`/api/extract-advances/${id}`);

// ─── Procurements (توريدات) ───────────────────────────────────────────────────

/** Fetch all procurements. Supports: page, limit, status, procurementType, company, project */
export const getFFProcurements = (params = {}) =>
  ffFetch('/api/procurements', { limit: 100, ...params });

/** Fetch a single procurement by MongoDB ObjectId string */
export const getFFProcurementById = (id) =>
  ffFetch(`/api/procurements/${id}`);
