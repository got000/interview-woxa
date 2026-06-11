import { Test, TestingModule } from '@nestjs/testing';
import { HelperService } from './helper.service';

describe('HelperService', () => {
  let service: HelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperService],
    }).compile();

    service = module.get<HelperService>(HelperService);
  });

  describe('getSearchRegExp', () => {
    it('returns null for an empty search string', () => {
      expect(service.getSearchRegExp('')).toBeNull();
    });

    it('returns a case-insensitive RegExp for a search string', () => {
      const result = service.getSearchRegExp('exness');

      expect(result).toEqual(new RegExp('exness', 'i'));
    });

    it('escapes a dot before building the RegExp', () => {
      const result = service.getSearchRegExp('a.b');

      expect(result).toEqual(new RegExp('a\\.b', 'i'));
    });
  });
});
