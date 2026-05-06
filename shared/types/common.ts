export interface BaseEntity {
  id: string;

  createdAt?: Date | string;

  updatedAt?: Date | string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface TableColumn<T = any> {
  key: keyof T;

  title: string;

  width?: number | string;
}

export interface StatusProps {
  active: boolean;
}

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type AsyncStatus = "idle" | "loading" | "success" | "error";
