export type ApiResponse<T> = {
  data?: T;
  message?: string;
  error?: string;
  status: number;
};
