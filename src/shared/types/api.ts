export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = { ok: false; error: string };
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export function isApiSuccess<T>(result: ApiResult<T>): result is ApiSuccess<T> {
  return result.ok === true;
}
