import './style.css'

// =================
// CONSTANTS / STATE
// =================
const CHARACTERS_URL = 'https://rickandmortyapi.com/api/character/'
const FAVORITE_PREFIX = 'character.id='

let characters = []          // personajes de la página actual (o acumulados si usas "Cargar más")
let allLoadedCharacters = [] // acumulado para filtros cuando se usa paginación

let textInput = ''
let valueStatus = ''
let valueSpecies = ''

// =================
// DOM
// =================
const body = document.querySelector('body')
const divCharacters = document.getElementById('divCharacters')
const filterNameInput = document.getElementById('filterName')
const filterStatus = document.getElementById('filterStatus')
const filterSpecies = document.getElementById('filterSpecies')
const loadMoreContainer = document.getElementById('loadMoreContainer')
const statusEl = document.getElementById('status')

// =================
// UI STATES
// =================
function setLoading(message = 'Cargando...') {
  if (!statusEl) return
  statusEl.className = 'status is-loading'
  statusEl.textContent = message
}

function setError(message = 'Ha ocurrido un error al cargar los datos.') {
  if (!statusEl) return
  statusEl.className = 'status is-error'
  statusEl.textContent = message
}

function clearStatus() {
  if (!statusEl) return
  statusEl.className = 'status'
  statusEl.textContent = ''
}

function setButtonDisabled(disabled) {
  document.querySelectorAll('button').forEach((btn) => {
    btn.disabled = disabled
  })
}

// =================
// HELPERS
// =================
async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function baseUrl(path) {
  // Compatible con Vite en dev y en GitHub Pages (base distinta)
  return `${import.meta.env.BASE_URL}${path}`
}

function resetSelect(selectEl) {
  if (!selectEl) return
  selectEl.innerHTML = ''
  const optionDefault = document.createElement('option')
  optionDefault.value = ''
  optionDefault.textContent = 'Todo'
  selectEl.appendChild(optionDefault)
}

function getFavoritesFromStorage() {
  const keys = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(FAVORITE_PREFIX)) keys.push(key)
  }

  return keys.map((key) => {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch {
      return null
    }
  })
  .filter(Boolean)
}

function isFavorite(id) {
  return Boolean(localStorage.getItem(`${FAVORITE_PREFIX}${id}`))
}

function toggleFavorite(id, character) {
  const key = `${FAVORITE_PREFIX}${id}`
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key)
    return false
  }
  localStorage.setItem(key, JSON.stringify(character))
  return true
}

// =================
// SELECTS
// =================
function buildSelectsFromCharacters(list) {
  // Evita duplicados al cargar más páginas
  const statuses = [...new Set(list.map((c) => c.status).filter(Boolean))]
  const species = [...new Set(list.map((c) => c.species).filter(Boolean))]

  resetSelect(filterStatus)
  resetSelect(filterSpecies)

  statuses.forEach((status) => {
    const opt = document.createElement('option')
    opt.value = status.toLowerCase()
    opt.textContent = status
    filterStatus.appendChild(opt)
  })

  species.forEach((sp) => {
    const opt = document.createElement('option')
    opt.value = sp.toLowerCase()
    opt.textContent = sp
    filterSpecies.appendChild(opt)
  })
}

// =================
// PAGINATION
// =================
function createLoadMoreBtn(nextPageUrl) {
  if (!loadMoreContainer) return

  loadMoreContainer.innerHTML = ''

  if (!nextPageUrl) return

  const loadMoreBtn = document.createElement('button')
  loadMoreBtn.id = 'loadMoreBtn'
  loadMoreBtn.className = 'button'
  loadMoreBtn.type = 'button'
  loadMoreBtn.textContent = 'Cargar más'

  loadMoreBtn.addEventListener('click', () => {
    loadCharacters(nextPageUrl, { append: true })
  })

  loadMoreContainer.appendChild(loadMoreBtn)
}

// =================
// FETCH + RENDER
// =================
async function loadCharacters(url, { append = false } = {}) {
  if (!divCharacters) return

  try {
    setLoading('Cargando personajes...')
    setButtonDisabled(true)

    const data = await fetchJson(url)

    // Paginación: next
    createLoadMoreBtn(data.info?.next || null)

    if (append) {
      characters = [...characters, ...data.results]
    } else {
      characters = data.results
    }

    // Este array es el que usamos para filtrar (incluye páginas cargadas)
    allLoadedCharacters = characters

    // Construir selects con lo cargado (solo si existen)
    if (filterStatus && filterSpecies) {
      buildSelectsFromCharacters(allLoadedCharacters)
    }

    // Render con filtros actuales aplicados
    renderCharacters(applyFilters(allLoadedCharacters))

    clearStatus()
  } catch (err) {
    console.error(err)
    setError('No se pudieron cargar los personajes. Revisa tu conexión o el endpoint.')
  } finally {
    setButtonDisabled(false)
  }
}

function renderHeader() {
  if (!body) return

  const header = document.querySelector('header')
  const nav = document.createElement('div')

  header.appendChild(nav)

  // Home
  const homeBtn = document.createElement('button')
  homeBtn.id = 'home'
  homeBtn.className = 'button'
  homeBtn.textContent = 'Inicio'

  // Favorites
  const favoriteSectionBtn = document.createElement('button')
  favoriteSectionBtn.id = 'favoriteSectionBtn'
  favoriteSectionBtn.className = 'button'
  favoriteSectionBtn.textContent = 'Favoritos'

  // Episodes
  const episodesBtn = document.createElement('button')
  episodesBtn.id = 'episodesBtn'
  episodesBtn.className = 'button'
  episodesBtn.textContent = 'Episodios'

  nav.append(homeBtn, favoriteSectionBtn, episodesBtn)

  episodesBtn.addEventListener('click', () => {
    window.location.href = baseUrl('src/pages/episodes.html')
  })

  favoriteSectionBtn.addEventListener('click', () => {
    const favorites = getFavoritesFromStorage()
    renderCharacters(favorites)
  })

  homeBtn.addEventListener('click', () => {
    window.location.href = baseUrl('')
  })
}

function renderCharacters(list) {
  if (!divCharacters) return

  divCharacters.innerHTML = ''

  if (!Array.isArray(list) || list.length === 0) {
    const h3 = document.createElement('h3')
    h3.textContent = 'No hemos encontrado ningún resultado'
    divCharacters.appendChild(h3)
    return
  }

  list.forEach((character) => {
    const card = document.createElement('article')
    card.className = 'card'
    card.dataset.id = character.id

    // Botón favorito
    const favoriteBtn = document.createElement('button')
    favoriteBtn.type = 'button'
    favoriteBtn.className = 'button'
    favoriteBtn.textContent = isFavorite(character.id)
      ? 'Favorito ❤️'
      : 'Marcar como favorito 🤍'

    favoriteBtn.addEventListener('click', (event) => {
      // Evita que el click dispare la navegación al detalle
      event.stopPropagation()

      const fav = toggleFavorite(character.id, character)
      favoriteBtn.textContent = fav ? 'Favorito ❤️' : 'Marcar como favorito 🤍'
    })

    // Zona clickable (detalle)
    const clickable = document.createElement('div')
    clickable.className = 'divCharactersCliclable'
    clickable.style.cursor = 'pointer'

    const img = document.createElement('img')
    img.src = character.image
    img.alt = character.name

    const h3 = document.createElement('h3')
    h3.textContent = character.name

    const p = document.createElement('p')
    p.textContent = `${character.status}, ${character.gender}, ${character.species}`

    clickable.append(img, h3, p)

    // Navegación a detalle
    clickable.addEventListener('click', () => {
      window.location.href = baseUrl(`src/pages/characterDetail.html?id=${character.id}`)
    })

    card.append(favoriteBtn, clickable)
    divCharacters.appendChild(card)
  })
}

// =================
// FILTERS
// =================
function applyFilters(list) {
  let filtered = list

  // Nombre
  if (textInput.length > 0) {
    filtered = filtered.filter((c) =>
      c.name.toLowerCase().includes(textInput)
    )
  }

  // Status
  if (valueStatus.length > 0) {
    filtered = filtered.filter((c) => c.status.toLowerCase() === valueStatus)
  }

  // Species
  if (valueSpecies.length > 0) {
    filtered = filtered.filter((c) => c.species.toLowerCase() === valueSpecies)
  }

  return filtered
}

// =================
// LISTENERS (guarded)
// =================
if (filterNameInput) {
  filterNameInput.addEventListener('input', (event) => {
    textInput = event.target.value.trim().toLowerCase()
    renderCharacters(applyFilters(allLoadedCharacters))
  })
}

if (filterStatus) {
  filterStatus.addEventListener('change', () => {
    valueStatus = filterStatus.value
    renderCharacters(applyFilters(allLoadedCharacters))
  })
}

if (filterSpecies) {
  filterSpecies.addEventListener('change', () => {
    valueSpecies = filterSpecies.value.trim().toLowerCase()
    renderCharacters(applyFilters(allLoadedCharacters))
  })
}

// =================
// INIT
// =================
renderHeader()
loadCharacters(CHARACTERS_URL)
