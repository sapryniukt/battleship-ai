import type { ContentEntry } from '~/types/markdown';
export const usePageContentFetch = async (keys: string[]): Promise<{ data: Ref<unknown> }> => {
  keys.push('cookies');

  const { locale } = useI18n();

  const idChain = keys.join(',');

  const { data } = await useFetch(`/api/contentful/${locale.value}`, {
    key: `contentful-${idChain}-${locale.value}`,
    query: { keys },
    server: true,
    lazy: false
  });

  // After receiving the full content structure, store it in the Pinia content store.
  const contentStore = useContentStore();
  contentStore.setContents(data.value as Record<string, ContentEntry>);

  return { data };
};
