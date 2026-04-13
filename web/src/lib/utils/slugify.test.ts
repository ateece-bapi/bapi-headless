import { describe, it, expect } from 'vitest';
import { slugify, slugifyArray } from './slugify';

describe('slugify', () => {
  describe('Customer Group Normalization', () => {
    it('converts "END USER" to "end-user"', () => {
      expect(slugify('END USER')).toBe('end-user');
    });

    it('converts "ALC" to "alc"', () => {
      expect(slugify('ALC')).toBe('alc');
    });

    it('converts "ACS" to "acs"', () => {
      expect(slugify('ACS')).toBe('acs');
    });

    it('converts "Buy Resell" to "buy-resell"', () => {
      expect(slugify('Buy Resell')).toBe('buy-resell');
    });

    it('converts "Humid Pres" to "humid-pres"', () => {
      expect(slugify('Humid Pres')).toBe('humid-pres');
    });
  });

  describe('Whitespace Handling', () => {
    it('trims leading whitespace', () => {
      expect(slugify('  END USER')).toBe('end-user');
    });

    it('trims trailing whitespace', () => {
      expect(slugify('END USER  ')).toBe('end-user');
    });

    it('trims both leading and trailing whitespace', () => {
      expect(slugify('  END USER  ')).toBe('end-user');
    });

    it('replaces multiple spaces with single hyphen', () => {
      expect(slugify('END    USER')).toBe('end-user');
    });

    it('handles tabs and newlines', () => {
      expect(slugify('END\tUSER\n')).toBe('end-user');
    });
  });

  describe('Special Characters', () => {
    it('removes special characters', () => {
      expect(slugify('END@USER!')).toBe('enduser');
    });

    it('preserves hyphens', () => {
      expect(slugify('end-user')).toBe('end-user');
    });

    it('removes multiple consecutive hyphens', () => {
      expect(slugify('end---user')).toBe('end-user');
    });

    it('removes leading hyphens', () => {
      expect(slugify('-end-user')).toBe('end-user');
    });

    it('removes trailing hyphens', () => {
      expect(slugify('end-user-')).toBe('end-user');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string', () => {
      expect(slugify('')).toBe('');
    });

    it('handles whitespace-only string', () => {
      expect(slugify('   ')).toBe('');
    });

    it('handles single word', () => {
      expect(slugify('ADMIN')).toBe('admin');
    });

    it('handles already-slugified string', () => {
      expect(slugify('end-user')).toBe('end-user');
    });

    it('handles numeric characters', () => {
      expect(slugify('Group 123')).toBe('group-123');
    });

    it('handles underscores (preserves as word characters)', () => {
      expect(slugify('customer_group')).toBe('customer_group');
    });
  });
});

describe('slugifyArray', () => {
  describe('Array Processing', () => {
    it('slugifies all strings in array', () => {
      const result = slugifyArray(['END USER', 'ALC', 'ACS']);
      expect(result).toEqual(['end-user', 'alc', 'acs']);
    });

    it('filters out null values', () => {
      const result = slugifyArray(['END USER', null, 'ALC']);
      expect(result).toEqual(['end-user', 'alc']);
    });

    it('filters out undefined values', () => {
      const result = slugifyArray(['END USER', undefined, 'ALC']);
      expect(result).toEqual(['end-user', 'alc']);
    });

    it('filters out empty strings', () => {
      const result = slugifyArray(['END USER', '', 'ALC']);
      expect(result).toEqual(['end-user', 'alc']);
    });

    it('removes duplicates after slugification', () => {
      const result = slugifyArray(['END USER', 'end-user', 'End User']);
      expect(result).toEqual(['end-user']);
    });

    it('trims whitespace before filtering', () => {
      const result = slugifyArray(['  ACS  ', 'ACS', '  acs  ']);
      expect(result).toEqual(['acs']);
    });
  });

  describe('Real-World Scenarios', () => {
    it('handles ACF customerGroup1/2/3 fields (with NO ACCESS)', () => {
      const result = slugifyArray(['END USER', 'ALC', 'NO ACCESS']);
      expect(result).toEqual(['end-user', 'alc', 'no-access']);
    });

    it('handles guest user (null values)', () => {
      const result = slugifyArray([null, null, null]);
      expect(result).toEqual([]);
    });

    it('handles single group user', () => {
      const result = slugifyArray(['ALC', null, null]);
      expect(result).toEqual(['alc']);
    });

    it('handles multi-group user', () => {
      const result = slugifyArray(['END USER', 'ALC', 'ACS']);
      expect(result).toEqual(['end-user', 'alc', 'acs']);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty array', () => {
      const result = slugifyArray([]);
      expect(result).toEqual([]);
    });

    it('handles array of nulls', () => {
      const result = slugifyArray([null, null]);
      expect(result).toEqual([]);
    });

    it('handles array of empty strings', () => {
      const result = slugifyArray(['', '  ', '']);
      expect(result).toEqual([]);
    });

    it('handles whitespace-only strings after trim', () => {
      const result = slugifyArray(['   ', 'ALC', '  ']);
      expect(result).toEqual(['alc']);
    });
  });
});
