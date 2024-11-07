// src/utils/tokenService.ts

export const setToken = (token: string): void => {
  localStorage.setItem("jwtToken", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("jwtToken");
};

export const removeToken = (): void => {
  localStorage.removeItem("jwtToken");
};
