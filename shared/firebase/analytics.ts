import { getAnalytics, isSupported } from "firebase/analytics";

import { firebaseApp } from "./config";

let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;

export async function getFirebaseAnalytics() {
  if (typeof window === "undefined") {
    return null;
  }

  const supported = await isSupported();

  if (!supported) {
    return null;
  }

  if (!analyticsInstance) {
    analyticsInstance = getAnalytics(firebaseApp);
  }

  return analyticsInstance;
}
