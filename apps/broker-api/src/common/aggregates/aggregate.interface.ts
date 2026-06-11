export interface ILookup {
  from: string;
  localField?: string;
  foreignField?: string;
  as: string;
  unwind?: boolean;
  pipeline?: any[];
  variable?: any;
}

export interface IPagination {
  skip: number;
  limit: number;
}

export interface ILookupInput {
  localField?: string;
  foreignField?: string;
  as?: string;
  unwind?: boolean;
  pipeline?: any[];
  variable?: any;
}

export interface ISorting {
  sortBy?: string;
  orderBy?: string;
}
