import { describe, expect, it } from 'vitest';
import { getProductImageUrl, normalizeImageName } from './imageUtils';

describe('image utilities', () => {
  it('normalizes unsafe names for placeholder routes', () => {
    expect(normalizeImageName('../Chef Kit.jpg')).toBe('chef-kit');
  });

  it('builds an API placeholder URL', () => {
    expect(getProductImageUrl('Essential Kit')).toContain('/api/images/direct/essential-kit');
  });
});
