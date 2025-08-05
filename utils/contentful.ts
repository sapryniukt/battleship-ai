import { createClient as createManagementClient, type Asset } from 'contentful-management';

function getManagementClient() {
  return createManagementClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!
  });
}

export async function createContentAsset(key: string, contentType: string, file: ArrayBuffer): Promise<void> {
  const space = await getManagementClient().getSpace(process.env.CONTENTFUL_SPACE_ID!);
  const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONEMENT!);

  try {
    const asset = await environment.createAssetFromFiles({
      fields: {
        title: { 'en-US': key },
        description: { 'en-US': '' },
        file: {
          'en-US': {
            contentType,
            fileName: key,
            file
          }
        }
      }
    });
    await asset.processForAllLocales();
  } catch (error) {
    console.error('Error in createContentAsset:', error);
  }
}

export async function fetchContentItem(key: string): Promise<Asset[] | null> {
  const space = await getManagementClient().getSpace(process.env.CONTENTFUL_SPACE_ID!);
  const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONEMENT!);
  const assets = await environment.getAssets({
    'fields.file.en-US.fileName': key
  });
  return assets?.items?.length ? assets.items : null;
}
