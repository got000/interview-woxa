export interface LangValue {
  th: string;
  en: string;
}

export type BrokerType = 'cfd' | 'bond' | 'stock' | 'crypto';

export const BROKER_TYPES: BrokerType[] = ['cfd', 'bond', 'stock', 'crypto'];

export interface ContentDetail {
  title: LangValue;
  paragraph: LangValue[];
}

export interface ContactDetail {
  address: string;
  email: string;
  web_site: string;
}

export interface PerformanceMetrics {
  aum_growth: number;
  liquidity_access: number;
  client_retention: number;
}

export interface Broker {
  _id: string;
  name: LangValue;
  desc: LangValue;
  slug: string;
  broker_type: BrokerType;
  logo_url: string;
  region: string;
  content_detail: ContentDetail;
  contact_detail: ContactDetail;
  performance_metrics?: PerformanceMetrics;
  status: string;
}

export interface CreateBrokerInput {
  name: LangValue;
  desc: LangValue;
  slug: string;
  broker_type: BrokerType;
  logo_url: string;
  region: string;
  content_detail: ContentDetail;
  contact_detail: ContactDetail;
}

export type BrokerStatus = 'active' | 'inactive';

export interface CreateUserInput {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface ApiResponse<T = undefined> {
  status_code: number;
  code: string;
  message: string;
  result?: T;
}

export interface Pagination {
  current_page: number;
  total_pages: number;
  total: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}
