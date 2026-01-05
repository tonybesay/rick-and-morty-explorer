const state = {
  characters: [],
  allLoaded: [],
  nextPageUrl: null,
  filters: {
    name: '',
    status: '',
    species: '',
  },
}

export const getState = () => state

export function setCharacters(list, { append = false } = {}) {
  state.characters = append ? [...state.characters, ...list] : list
  state.allLoaded = state.characters
}

export function setNextPageUrl(url) {
  state.nextPageUrl = url
}

export function setFilters(partial) {
  state.filters = { ...state.filters, ...partial }
}