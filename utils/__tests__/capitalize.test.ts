import { describe, it, expect } from 'vitest';
import capitalize from '../capitalize';

describe('capitalize', () => {
  it('should capitalize the first letter of a lowercase string', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should not change a string that is already capitalized', () => {
    expect(capitalize('World')).toBe('World');
  });

  it('should handle a single character string', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('should handle an empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('should handle a string with leading whitespace', () => {
    expect(capitalize('  space')).toBe('  space');
  });
});
