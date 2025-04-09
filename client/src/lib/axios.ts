import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { toast } from "react-hot-toast";

export interface ApiErrorResponse {
  error: {
    code: number;
    message: string;
    stack?: string;
  };
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.error) {
      const error = response.data.error;
      toast.error(error.message || "An error occurred");
      throw new ApiError(error.code, error.message);
    }
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (!error.response) {
      toast.error("Network error. Please check your connection.");
      throw new ApiError(500, "Network error. Please check your connection.");
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        toast.error(data?.error?.message || "Bad request");
        throw new ApiError(400, data?.error?.message || "Bad request");
      case 401:
        toast.error("Unauthorized. Please login again.");
        throw new ApiError(401, "Unauthorized. Please login again.");
      case 403:
        toast.error("Access forbidden");
        throw new ApiError(403, "Access forbidden");
      case 404:
        toast.error("Resource not found");
        throw new ApiError(404, "Resource not found");
      case 500:
        toast.error("Server error. Please try again later.");
        throw new ApiError(500, "Server error. Please try again later.");
      default:
        toast.error(data?.error?.message || "An unexpected error occurred");
        throw new ApiError(
          status,
          data?.error?.message || "An unexpected error occurred"
        );
    }
  }
);

export default axiosInstance;
