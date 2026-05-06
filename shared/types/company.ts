export interface CompanyAddress {
  street?: string;

  number?: string;

  district?: string;

  city?: string;

  state?: string;

  zipCode?: string;

  country?: string;
}

export interface Company {
  id: string;

  name: string;

  fantasyName?: string;

  document: string;

  email?: string;

  phone?: string;

  logoUrl?: string;

  address?: CompanyAddress;

  active: boolean;

  createdAt?: Date | string;

  updatedAt?: Date | string;
}

export interface CompanySector {
  id: string;

  companyId: string;

  name: string;

  description?: string;

  active: boolean;
}
