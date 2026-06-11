import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  constructor() {}

  getSearchRegExp(search: string) {
    if (!search) return null;
    if (search?.includes('.')) {
      search = search?.replace('.', '\\.');
    }
    return search ? new RegExp(search, 'i') : null;
  }
}
