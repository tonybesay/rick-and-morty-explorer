import { FAVORITE_CHARACTER_PREFIX } from '../core/config'

// Generic helpers (reusable)
export function isFavoriteWithPrefix(prefix, id) {
  return Boolean(localStorage.getItem(`${prefix}${id}`))
}

export function toggleFavoriteWithPrefix(prefix, id, data) {
  const key = `${prefix}${id}`
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key)
    return false
  }
  localStorage.setItem(key, JSON.stringify(data))
  return true
}

export function getFavoritesWithPrefix(prefix) {
  const list = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(prefix)) {
      try {
        list.push(JSON.parse(localStorage.getItem(key)))
      } catch {
        // ignore malformed JSON
      }
    }
  }
  return list
}

// Character-specific wrappers (keeps current API)
export function isFavorite(id) {
  return isFavoriteWithPrefix(FAVORITE_CHARACTER_PREFIX, id)
}

export function toggleFavorite(id, character) {
  return toggleFavoriteWithPrefix(FAVORITE_CHARACTER_PREFIX, id, character)
}

export function getFavorites() {
  return getFavoritesWithPrefix(FAVORITE_CHARACTER_PREFIX)
}