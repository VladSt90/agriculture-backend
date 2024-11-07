// src/services/apiService.ts

import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { Navigate } from "react-router-dom";
import { getToken, removeToken, setToken } from "../utils/tokenService";

interface LoginResponse {
  access: string;
  refresh?: string;
}

interface LoginData {
  username: string;
  password: string;
}

export interface Image {
  url: string;
  ml_result: string;
}

export interface ImageSet {
  id: string;
  title: string;
  createdAt: string;
  status: string;
  images: Image[];
}

class ApiService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: "http://localhost/api", // Replace with your API's base URL
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add a request interceptor to include the JWT token in every request
    this.apiClient.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add a response interceptor to handle token expiration and missing credentials
    this.apiClient.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          if (error.response.data?.code === "token_not_valid") {
            originalRequest._retry = true;
            try {
              const refreshToken = localStorage.getItem("refreshToken");
              if (refreshToken) {
                const refreshResponse = await this.refreshToken(refreshToken);
                const newAccessToken = refreshResponse.data.access;
                setToken(newAccessToken);
                originalRequest.headers[
                  "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return this.apiClient(originalRequest);
              }
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              removeToken();
              Navigate({ to: "/" }); // Redirect to login page
            }
          } else if (
            error.response.data?.detail ===
            "Authentication credentials were not provided."
          ) {
            console.error("Authentication credentials missing.");
            removeToken();
            Navigate({ to: "/" }); // Redirect to login page
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async login(
    username: string,
    password: string
  ): Promise<AxiosResponse<LoginResponse>> {
    try {
      const response = await this.apiClient.post<LoginResponse>("/token/", {
        username,
        password,
      });
      const { access, refresh } = response.data;
      setToken(access);
      if (refresh) {
        localStorage.setItem("refreshToken", refresh);
      }
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  async refreshToken(
    refreshToken: string
  ): Promise<AxiosResponse<LoginResponse>> {
    try {
      const response = await this.apiClient.post<LoginResponse>(
        "/token/refresh/",
        {
          refresh: refreshToken,
        }
      );
      const { access } = response.data;
      setToken(access);
      return response;
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  }

  async register(
    username: string,
    password: string
  ): Promise<AxiosResponse<any>> {
    try {
      const response = await this.apiClient.post("/register/", {
        username,
        password,
      });
      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  async getImageSets(): Promise<AxiosResponse<ImageSet[]>> {
    try {
      const response = await this.apiClient.get<ImageSet[]>("/imagesets/");
      return response;
    } catch (error) {
      console.error("Failed to fetch image sets:", error);
      throw error;
    }
  }

  async getImageSetById(imagesetId: string): Promise<AxiosResponse<ImageSet>> {
    try {
      const response = await this.apiClient.get<ImageSet>(
        `/imagesets/${imagesetId}/`
      );
      return response;
    } catch (error) {
      console.error("Failed to fetch image set by ID:", error);
      throw error;
    }
  }

  async createImageSet(
    title: string,
    images: File[]
  ): Promise<AxiosResponse<ImageSet>> {
    try {
      const formData = new FormData();
      formData.append("title", title);
      images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      const response = await this.apiClient.post<ImageSet>(
        "/imagesets/create/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Failed to create image set:", error);
      throw error;
    }
  }

  async processImageSet(imagesetId: string): Promise<AxiosResponse<any>> {
    try {
      const response = await this.apiClient.post(
        `/imagesets/${imagesetId}/process/`
      );
      return response;
    } catch (error) {
      console.error("Failed to process image set:", error);
      throw error;
    }
  }
}

export default new ApiService();
