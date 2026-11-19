/* ── Auth types (hand-written) ──────────────────────────────────── */
// Not generated: `npm run gen:api-types` overwrites api.gen.ts and would wipe
// these. Mirrors api-rag/app/models/schemas.py.

export type Role = 'administrativo' | 'consultor';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface MeResponse {
  email: string | null;
  role: Role;
  via_api_key: boolean;
}

export interface CurrentUser {
  email: string;
  role: Role;
}

export interface UserRecord {
  id: number;
  email: string;
  full_name: string;
  role: Role;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
}

export interface CreateUserRequest {
  email: string;
  full_name?: string;
  password: string;
  role: Role;
}

export interface UpdateUserRequest {
  is_active?: boolean;
  role?: Role;
}
