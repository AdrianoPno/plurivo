"use client";

import { STORAGE_KEYS } from "../constants/storage-keys";

export function saveSession(token: string) {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

export function getSessionToken() {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

export function hasSession() {
  return !!getSessionToken();
}
