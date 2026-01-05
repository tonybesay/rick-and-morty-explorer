import '../../style.css'

import { EPISODES_URL, FAVORITE_EPISODE_PREFIX } from '../core/config'
import { fetchJson } from '../core/api'
import { baseUrl } from '../core/router'
import { renderHeader } from '../ui/header'
import { setLoading, setError, clearStatus } from '../ui/status'
import { renderEpisodesList } from '../ui/episodesView'
import { getFavoritesWithPrefix } from '../storage/favorites'

async function getCharacterName(url) {
  const data = await fetchJson(url)
  return { id: data.id, name: data.name }
}

async function loadEpisodes() {
  try {
    setLoading('Cargando episodios...')
    const data = await fetchJson(EPISODES_URL)
    await renderEpisodesList(data.results, getCharacterName)
    clearStatus()
  } catch (err) {
    console.error(err)
    setError('No se pudieron cargar los episodios.')
  }
}

renderHeader({
  onHome: () => {
    window.location.href = baseUrl('')
  },
  onFavorites: async () => {
    const favs = getFavoritesWithPrefix(FAVORITE_EPISODE_PREFIX)
    await renderEpisodesList(favs, getCharacterName)
  },
})

loadEpisodes()