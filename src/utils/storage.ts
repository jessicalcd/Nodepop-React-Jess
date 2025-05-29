const TOKEN_KEY = 'nodepop_authToken';
const REMEMBER_ME_KEY = 'nodepop_rememberMe';


export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};


export const storeToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};


export const removeStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};


export const getShouldRememberSession = (): boolean => {
  return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
};


export const setShouldRememberSession = (remember: boolean): void => {
  localStorage.setItem(REMEMBER_ME_KEY, String(remember));
};