import '../../style.css'

import { CHARACTERS_URL } from '../core/config'
import { fetchJson } from '../core/api'
import { getQueryParam, baseUrl } from '../core/router'
import { renderHeader } from '../ui/header'
import { setLoading, setError, clearStatus } from '../ui/status'
import { renderCharacterDetail } from '../ui/charactersView'

async function loadCharacterDetail() {
  const id = getQueryParam('id')
  if (!id) {
    setError('Falta el id del personaje en la URL.')
    return
  }

  try {
    setLoading('Cargando personaje...')
    const character = await fetchJson(`${CHARACTERS_URL}${id}`)
    renderCharacterDetail(character)
    clearStatus()
  } catch (err) {
    console.error(err)
    setError('No se pudo cargar el personaje.')
  }
}

renderHeader({
  onHome: () => (window.location.href = baseUrl('')),
})

loadCharacterDetail()