import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { toast } from "sonner";

// ---- Basic configuration
const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://api.example.com",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
};

const client: AxiosInstance = axios.create(config);

// ---- Helper: network retry (1x)
const shouldNetworkRetry = (error: AxiosError) =>
  !error.response || error.code === "ECONNABORTED" || (error as any).code === "ERR_NETWORK";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---- REQUEST
client.interceptors.request.use(
  (cfg) => cfg,
  (error) => Promise.reject(error)
);

// ---- RESPONSE
client.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean; _netRetry?: boolean };

    // 1) Network/timeout → toast + 1x retry
    if (shouldNetworkRetry(error)) {
      if (!original._netRetry) {
        original._netRetry = true;
        const offline = typeof navigator !== "undefined" && navigator && navigator.onLine === false;
        toast.error(offline ? "Connection lost. Trying again..." : "Network issue. Trying again...");
        await sleep(600);
        return client.request(original);
      }
      const offline = typeof navigator !== "undefined" && navigator && navigator.onLine === false;
      toast.error(offline ? "You are offline." : "Failed to connect to server.");
      return Promise.reject(error);
    }

    // 2) 401 → refresh token once
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      toast.error("Session expired. Please login again.");
      return Promise.reject(error);
    }

    // 3) Other error → toast & normalization
    const status = error.response?.status ?? "ERR";
    const message =
      (error.response?.data as any)?.message ??
      (error.response?.data as any)?.error ??
      error.message ??
      "Request failed";

    if (typeof status === "number" && status >= 500) {
      toast.error("Server error. Try again later.");
    } else {
      toast.error(typeof message === "string" ? message : "Request failed.");
    }

    return Promise.reject({
      status: error.response?.status,
      data: error.response?.data,
      message,
    });
  }
);

export default client;
