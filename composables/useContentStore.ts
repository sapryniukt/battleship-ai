import { defineStore } from 'pinia';
import type { ContentEntry } from '~/types/markdown';
export const useContentStore = defineStore('content', () => {
  const route = useRoute();
  const routes = useRouter().getRoutes();
  // This will store the complete response from the GraphQL API,
  // for example: { header: { fields: { ... } }, about: { fields: { ... } }, footer: { fields: { ... } } }
  const contents = ref<{ [x: string]: Ref<Record<string, ContentEntry>> }>(
    Object.fromEntries(routes.map((route) => [route.path, ref({})]))
  );

  /**
   * Set the fetched content into the store.
   * @param data - The data retrieved from the API.
   */
  function setContents(data: Record<string, ContentEntry>) {
    if (!contents.value[route.path]) {
      contents.value[route.path] = ref({});
    }
    contents.value[route.path].value = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value]));
  }

  /**
   * Get the content for the current route.
   * @returns Ref<Record<string, ContentEntry>> The content data for the current route path.
   */
  const content = computed(() => contents?.value?.[route.path]?.value);

  return {
    contents,
    content,
    setContents
  };
});
