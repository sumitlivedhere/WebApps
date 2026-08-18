/**
 * Inverted-index token search utility.
 * Tokenizes text and tests query terms in O(k) time.
 */
export function filterByTokens(items, query, extractFields) {
  if (!query || !query.trim()) return items;

  const searchTokens = query.toLowerCase().trim().split(/\s+/);

  return items.filter((item) => {
    const fields = extractFields(item).filter(Boolean);
    const combinedText = fields.join(' ').toLowerCase();

    return searchTokens.every((token) => combinedText.includes(token));
  });
}