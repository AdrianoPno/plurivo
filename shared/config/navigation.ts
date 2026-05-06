import { ROUTES } from "../constants/routes";

export interface NavigationItem {
  label: string;

  href: string;

  icon?: string;

  children?: NavigationItem[];

  disabled?: boolean;
}

export const navigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: "layout-dashboard",
  },

  {
    label: "Observatory",
    href: ROUTES.OBSERVATORY.ROOT,
    icon: "bar-chart-3",
  },

  {
    label: "Analytics",
    href: ROUTES.OBSERVATORY.ANALYTICS,
    icon: "line-chart",
  },

  {
    label: "Configurações",
    href: ROUTES.OBSERVATORY.SETTINGS,
    icon: "settings",
  },
];
