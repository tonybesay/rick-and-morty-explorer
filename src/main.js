import './style.css'

import { CHARACTERS_URL } from './js/core/config'
import { fetchJson } from './js/core/api'
import { getState, setCharacters, setNextPageUrl, setFilters } from './js/core/state'

import { renderHeader } from './js/ui/header'
import { setLoading, setError, clearStatus } from './js/ui/status'
import { renderCharacters } from './js/ui/charactersView'
import { renderLoadMore } from './js/ui/pagination'
import { bindFilters, buildSelectsFromCharacters, applyFilters } from './js/ui/filters'

import { getFavorites } from './js/storage/favorites'
import { el } from './js/core/dom'

async function loadCharacters(url, { append = false } = {}) {
  if (!el.divCharacters) return

  try {
    setLoading('Cargando personajes...')

    const data = await fetchJson(url)

    setNextPageUrl(data.info?.next ?? null)
    setCharacters(data.results, { append })

    const state = getState()
    buildSelectsFromCharacters(state.allLoaded)

    const filtered = applyFilters(state.allLoaded, state.filters)
    renderCharacters(filtered)

    renderLoadMore(state.nextPageUrl, () => {
      loadCharacters(state.nextPageUrl, { append: true })
    })

    clearStatus()
  } catch (err) {
    console.error(err)
    setError('No se pudieron cargar los personajes. Revisa tu conexión o el endpoint.')
  }
}

renderHeader({
  onHome: () => loadCharacters(CHARACTERS_URL),
  onFavorites: () => renderCharacters(getFavorites()),
})

bindFilters((partial) => {
  setFilters(partial)
  const state = getState()
  renderCharacters(applyFilters(state.allLoaded, state.filters))
})

loadCharacters(CHARACTERS_URL)