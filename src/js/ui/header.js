import { el } from '../core/dom'
import { baseUrl } from '../core/router'

function setActive(button, allButtons) {
  allButtons.forEach((b) => b.classList.remove('nav-btn--active'))
  button.classList.add('nav-btn--active')
}

export function renderHeader({ onHome, onFavorites } = {}) {
  if (!el.body) return

  // Prefer the header already present in the page (index.html).
  // Buttons are injected into #headerActions.
  let header = document.querySelector('header')
  let host = document.getElementById('headerActions')

  // If the page doesn't have a header/host (e.g., detail/episodes), create a compact one.
  if (!header || !host) {
    // Avoid duplicating if we already created it
    header = document.querySelector('header[data-generated="true"]')

    if (!header) {
      header = document.createElement('header')
      header.dataset.generated = 'true'
      header.className =
        'w-full border-b border-slate-800 bg-slate-950/60 backdrop-blur'

      const wrap = document.createElement('div')
      wrap.className =
        'container flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'

      const left = document.createElement('div')
      left.innerHTML =
        '<div class="text-lg font-bold">Rick and Morty Explorer</div><div class="subtle text-sm">Navegación</div>'

      host = document.createElement('div')
      host.id = 'headerActions'
      host.className = 'nav'

      wrap.append(left, host)
      header.appendChild(wrap)
      el.body.prepend(header)
    } else {
      host = header.querySelector('#headerActions')
    }
  }

  if (!host) return

  // Inject nav buttons
  host.innerHTML = ''

  const homeBtn = document.createElement('button')
  homeBtn.type = 'button'
  homeBtn.className = 'nav-btn'
  homeBtn.textContent = 'Inicio'

  const favoriteBtn = document.createElement('button')
  favoriteBtn.type = 'button'
  favoriteBtn.className = 'nav-btn'
  favoriteBtn.textContent = 'Favoritos'

  const episodesBtn = document.createElement('button')
  episodesBtn.type = 'button'
  episodesBtn.className = 'nav-btn'
  episodesBtn.textContent = 'Episodios'

  const buttons = [homeBtn, favoriteBtn, episodesBtn]
  host.append(...buttons)

  // Set active based on current path
  const path = window.location.pathname
  if (path.includes('/src/pages/episodes.html')) {
    setActive(episodesBtn, buttons)
  } else if (path.includes('/src/pages/characterDetail.html')) {
    // Detail page: keep Inicio active (no dedicated tab)
    setActive(homeBtn, buttons)
  } else {
    // Home
    setActive(homeBtn, buttons)
  }

  homeBtn.addEventListener('click', () => {
    setActive(homeBtn, buttons)
    if (typeof onHome === 'function') onHome()
    else window.location.href = baseUrl('')
  })

  favoriteBtn.addEventListener('click', () => {
    setActive(favoriteBtn, buttons)
    if (typeof onFavorites === 'function') onFavorites()
  })

  episodesBtn.addEventListener('click', () => {
    setActive(episodesBtn, buttons)
    window.location.href = baseUrl('src/pages/episodes.html')
  })
}