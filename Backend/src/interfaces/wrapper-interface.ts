export interface ApiResponse<T> {
  status: boolean;
  data: T | null;
  message: string;
  code: number;
  errors?: Record<string, string>;
}

export interface SuccessResponse<T> {
  err: null;
  data: T;
}

export interface ErrorResponse {
  err: Error;
  data: null;
}

export type ResponseResult<T> = SuccessResponse<T> | ErrorResponse;
