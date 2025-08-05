/**
 * Returns a computed reference to a single content entry by its key.
 * The returned value is the "fields" content of that entry.
 *
 * @param entryKey - The key of the content entry (e.g., 'header').
 */
export const useContentEntry = <T>(entryKey: string) => {
  const contentStore = useContentStore();
  const fields = ref<T>(contentStore.content?.[entryKey]?.fields as T);

  watch(
    () => contentStore.content,
    (newContent) => {
      if (newContent?.[entryKey]) {
        fields.value = newContent?.[entryKey].fields;
      }
    }
  );

  return fields;
};
