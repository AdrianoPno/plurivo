import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { firebaseAuth } from "../firebase/auth";

interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login({ email, password }: LoginParams) {
    const response = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );

    const token = await response.user.getIdToken();

    return {
      user: response.user,
      token,
    };
  },

  async register({ name, email, password }: RegisterParams) {
    const response = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );

    await updateProfile(response.user, {
      displayName: name,
    });

    const token = await response.user.getIdToken();

    return {
      user: response.user,
      token,
    };
  },

  async logout() {
    await signOut(firebaseAuth);
  },

  async getToken() {
    return firebaseAuth.currentUser?.getIdToken();
  },

  getCurrentUser() {
    return firebaseAuth.currentUser;
  },
};
