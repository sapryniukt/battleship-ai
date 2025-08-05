import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createContentAsset, fetchContentItem } from '~/utils/contentful';

vi.mock('contentful-management', () => {
  const mockAsset = {
    processForAllLocales: vi.fn().mockResolvedValue(undefined)
  };

  const getAssets = vi.fn().mockResolvedValue({ items: [{ sys: { id: 'asset123' }, fields: {} }] });

  const mockEnvironment = {
    createAssetFromFiles: vi.fn().mockResolvedValue(mockAsset),
    getAssets
  };

  const mockSpace = {
    getEnvironment: vi.fn().mockResolvedValue(mockEnvironment)
  };

  return {
    createClient: vi.fn(() => ({
      getSpace: vi.fn(() => Promise.resolve(mockSpace))
    }))
  };
});

describe('contentful utils', () => {
  const env = process.env;

  beforeEach(() => {
    process.env = {
      ...env,
      CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: 'token',
      CONTENTFUL_SPACE_ID: 'space',
      CONTENTFUL_ENVIRONEMENT: 'master'
    };
  });

  it('creates an asset with correct fields and processes it', async () => {
    const file = new ArrayBuffer(8);
    await expect(createContentAsset('test-key.png', 'image/png', file)).resolves.toBeUndefined();
  });

  it('fetches asset items by filename', async () => {
    const result = await fetchContentItem('test-key.png');
    expect(result).not.toBeNull();
    expect(result?.[0].sys.id).toBe('asset123');
  });

  it('returns null when no matching asset is found', async () => {
    const contentfulManagement = await import('contentful-management');
    const client = contentfulManagement.createClient({ accessToken: 'token' });
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const env = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONEMENT!);
    env.getAssets = vi.fn().mockResolvedValueOnce({ items: [] });

    const result = await fetchContentItem('missing.png');
    expect(result).toBeNull();
  });

  it('handles errors in createContentAsset gracefully', async () => {
    const contentfulManagement = await import('contentful-management');
    const client = contentfulManagement.createClient({ accessToken: 'token' });
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const env = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONEMENT!);
    env.createAssetFromFiles = vi.fn().mockRejectedValue(new Error('Failed to create asset'));

    const file = new ArrayBuffer(8);
    await expect(createContentAsset('error-key.png', 'image/png', file)).resolves.toBeUndefined();
  });

  it('handles missing processForAllLocales method safely', async () => {
    const contentfulManagement = await import('contentful-management');
    const client = contentfulManagement.createClient({ accessToken: 'token' });
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const env = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONEMENT!);

    const mockAsset = {};
    env.createAssetFromFiles = vi.fn().mockResolvedValue(mockAsset);

    const file = new ArrayBuffer(8);
    await expect(createContentAsset('missing-process.png', 'image/png', file)).resolves.toBeUndefined();
  });

  it('fetchContentItem returns null for unexpected response format', async () => {
    const contentfulManagement = await import('contentful-management');
    const client = contentfulManagement.createClient({ accessToken: 'token' });
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const env = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONEMENT!);
    env.getAssets = vi.fn().mockResolvedValueOnce(undefined);

    const result = await fetchContentItem('unexpected.png');
    expect(result).toBeNull();
  });
});
