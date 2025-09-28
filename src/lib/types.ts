// src/lib/types.ts
export interface User {
  id?: number;
  nickname?: string;
  name?: string;
  email?: string;
  last_login?: string;
  income?: number;
  expense?: number;
  access_token?: string;
  refresh_token?: string;
  // هر فیلد دلخواه دیگری که API ممکن است برگرداند
}

export interface ApiListResponse<T = any> {
  result: boolean;
  message?: string;
  data?: T[] | T;
}
