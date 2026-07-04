import axios, { AxiosError } from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong',
): string {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ msg?: string }>;
    if (err.code === 'ERR_NETWORK') {
      return 'Cannot reach the server right now. Please try again shortly.';
    }
    return err.response?.data?.msg ?? fallback;
  }
  return fallback;
}
