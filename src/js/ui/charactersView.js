import { el } from '../core/dom'
import { baseUrl } from '../core/router'
import { isFavorite, toggleFavorite } from '../storage/favorites'

export function renderCharacterDetail(character) {
  if (!el.detailCard) return

  el.detailCard.innerHTML = ''

  const img = document.createElement('img')
  img.src = character.image
  img.alt = character.name
  el.detailCard.appendChild(img)

  const h1 = document.querySelector('h1')
  if (h1) h1.textContent = character.name

  for (const key in character) {
    if (['image', 'url', 'created', 'id', 'name'].includes(key)) continue

    const p = document.createElement('p')
    p.textContent = `${key[0].toUpperCase() + key.slice(1)}: `
    el.detailCard.appendChild(p)

    if (key === 'episode') {
      character.episode.forEach((epUrl) => {
        const span = document.createElement('span')
        span.textContent = epUrl.split('/').at(-1) + ', '
        p.appendChild(span)
      })
      continue
    }

    if (key === 'location' || key === 'origin') {
      const span = document.createElement('span')
      span.textContent = character[key]?.name ?? 'Unknown'
      p.appendChild(span)
      continue
    }

    const span = document.createElement('span')
    span.textContent = character[key] || 'Unknown'
    p.appendChild(span)
  }
}


export function renderCharacters(list) {
  if (!el.divCharacters) return
  el.divCharacters.innerHTML = ''

  if (!Array.isArray(list) || list.length === 0) {
    const h3 = document.createElement('h3')
    h3.className = 'text-lg font-semibold text-slate-200'
    h3.textContent = 'No hemos encontrado ningún resultado'
    el.divCharacters.appendChild(h3)
    return
  }

  list.forEach((character) => {
    const card = document.createElement('article')
    card.className = 'card'
    card.dataset.id = character.id

    const clickable = document.createElement('div')
    clickable.className = 'space-y-3 cursor-pointer'

    const img = document.createElement('img')
    img.src = character.image
    img.alt = character.name
    img.loading = 'lazy'
    img.className = 'w-full rounded-xl border border-slate-800'

    /* ===== Row bajo la imagen ===== */
    const infoRow = document.createElement('div')
    infoRow.className = 'flex items-start justify-between gap-3'

    const leftInfo = document.createElement('div')
    leftInfo.className = 'min-w-0'

    const h3 = document.createElement('h3')
    h3.className = 'text-xl font-bold tracking-tight truncate'
    h3.textContent = character.name

    const p = document.createElement('p')
    p.className = 'text-sm text-slate-300'
    p.textContent = `${character.status}, ${character.gender}, ${character.species}`

    leftInfo.append(h3, p)

    /* ===== Favorito (igual que Episodes) ===== */
    const favoriteBtn = document.createElement('button')
    favoriteBtn.type = 'button'
    favoriteBtn.className = 'button button--ghost shrink-0'
    favoriteBtn.textContent = isFavorite(character.id)
      ? 'Favorito ❤️'
      : 'Favorito 🤍'

    favoriteBtn.addEventListener('click', (event) => {
      event.stopPropagation()
      const fav = toggleFavorite(character.id, character)
      favoriteBtn.textContent = fav ? 'Favorito ❤️' : 'Favorito 🤍'
    })

    infoRow.append(leftInfo, favoriteBtn)

    clickable.append(img, infoRow)

    clickable.addEventListener('click', () => {
      window.location.href = baseUrl(
        `src/pages/characterDetail.html?id=${character.id}`
      )
    })

    /* ===== CTA inferior ===== */
    const ctaRow = document.createElement('div')
    ctaRow.className = 'pt-2 flex justify-end'

    const cta = document.createElement('button')
    cta.type = 'button'
    cta.className = 'button'
    cta.textContent = 'Ver detalle'

    cta.addEventListener('click', (event) => {
      event.stopPropagation()
      window.location.href = baseUrl(
        `src/pages/characterDetail.html?id=${character.id}`
      )
    })

    ctaRow.appendChild(cta)

    card.append(clickable, ctaRow)
    el.divCharacters.appendChild(card)
  })
}
