import { request, gql } from 'nuxt-graphql-request/utils';

const CACHE_LIFETIME = 3600;

export default defineEventHandler(async (event) => {
  const locale = event.context.params!.locale;
  const config = useRuntimeConfig();

  // Function to validate and sanitize content type keys
  function validateContentTypeKey(key: string): string {
    // Check if key contains only alphanumeric characters, hyphens, and underscores
    if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid key format: ${key}. Keys must contain only alphanumeric characters, hyphens, and underscores.`
      });
    }

    const allowedKeys = Object.keys(config.public.contentful.entryIds);

    if (!allowedKeys.includes(key)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid content type: ${key}. Valid types are: ${allowedKeys.join(', ')}`
      });
    }

    return key;
  }

  setResponseHeader(event, 'Cache-Control', `s-maxage=${CACHE_LIFETIME}, stale-while-revalidate`);

  const queryParams = getQuery(event);
  const entries: { key: string; id: string }[] = [];

  if (!queryParams.keys) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required parameter: keys'
    });
  }

  const keys = Array.isArray(queryParams.keys) ? queryParams.keys : [queryParams.keys];

  keys.forEach((key: string) => {
    const entryIds = config.public.contentful.entryIds;

    // Check if the key exists in entryIds
    if (!(key in entryIds)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid key: ${key}. Valid keys are: ${Object.keys(entryIds).join(', ')}`
      });
    }

    entries.push({ key, id: entryIds[key as keyof typeof entryIds] });
  });

  const cacheKey = `contentful-content-${locale}-${JSON.stringify(entries)}`;
  const storage = useStorage();
  const cachedData = await storage.getItem(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Retrieve the Contentful configuration from runtime config.
  // (Adjust this if your config is located elsewhere)
  const { endpoint, accessToken } = config.public.contentful;

  // Dynamically build the GraphQL query.
  // For each entry in the array, I construct an aliased field:
  // e.g. header: header(id: $id_header, locale: $locale) { fields }
  const queryFragments = entries.map((entry) => {
    // Validate and sanitize the key before using it in the query
    const safeKey = validateContentTypeKey(entry.key);
    return `${safeKey}: ${safeKey}(id: $id_${safeKey}, locale: $locale) {
  fields
}`;
  });

  // Build variable definitions for each id.
  const variableDefinitions = entries.map((entry) => `$id_${entry.key}: String!`).join(', ');

  // Construct the final query string.
  const dynamicQuery = gql`
    query GetDynamicContent($locale: String!, ${variableDefinitions}) {
      ${queryFragments.join('\n')}
    }
  `;
  // Build the variables object
  const variables: Record<string, string> = { locale };
  entries.forEach((entry) => {
    variables[`id_${entry.key}`] = entry.id;
  });

  try {
    // Call the Contentful GraphQL endpoint with proper authentication
    const data = await request(endpoint, dynamicQuery, variables, { Authorization: `Bearer ${accessToken}` });
    // 'data' will now have keys matching your entries (e.g., data.header, data.footer, etc.)
    // Cache the full response for future requests
    storage.setItem(cacheKey, data as Record<string, unknown>, { maxAge: CACHE_LIFETIME });
    return data;
  } catch (error: unknown) {
    console.error('Contentful fetch error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch content from Contentful'
    });
  }
});
