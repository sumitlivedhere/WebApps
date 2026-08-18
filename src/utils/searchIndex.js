// src/utils/searchIndex.js

/**
 * Tokenizes text into normalized unique words
 */
function tokenize(text) {
  if (!text) return [];
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, ' ') // Preserves English & Devanagari Hindi characters
    .split(/\s+/)
    .filter(token => token.length > 1);
}

/**
 * Builds an in-memory inverted index map: token -> Set of items
 */
export function buildInvertedIndex(items = [], searchableFields = ['title', 'name', 'category', 'description', 'trade', 'tags']) {
  const index = new Map();

  items.forEach(item => {
    const combinedTokens = new Set();
    
    searchableFields.forEach(field => {
      if (item[field]) {
        const tokens = Array.isArray(item[field]) 
          ? item[field].flatMap(t => tokenize(t))
          : tokenize(item[field]);
        tokens.forEach(t => combinedTokens.add(t));
      }
    });

    combinedTokens.forEach(token => {
      if (!index.has(token)) {
        index.set(token, new Set());
      }
      index.get(token).add(item);
    });
  });

  return index;
}

/**
 * Searches the inverted index using prefix and multi-term intersection
 */
export function searchInvertedIndex(index, query) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  // Match items for each token (exact or prefix match)
  const tokenMatches = queryTokens.map(qToken => {
    const matchingItems = new Set();
    for (const [key, itemSet] of index.entries()) {
      if (key.startsWith(qToken)) {
        itemSet.forEach(item => matchingItems.add(item));
      }
    }
    return matchingItems;
  });

  // Intersection: return items that match all tokens
  if (tokenMatches.length === 0) return [];
  const result = [...tokenMatches[0]].filter(item =>
    tokenMatches.every(set => set.has(item))
  );

  return result;
}