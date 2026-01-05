import { el } from '../core/dom'
import { baseUrl } from '../core/router'
import {
  isFavoriteWithPrefix,
  toggleFavoriteWithPrefix,
} from '../storage/favorites'
import { FAVORITE_EPISODE_PREFIX } from '../core/config'

const MAX_BADGES = 9

function episodeCodeBadge(code) {
  const span = document.createElement('span')
  span.className = 'badge badge--indigo'
  span.textContent = code || 'Episode'
  return span
}

function pill(text) {
  const span = document.createElement('span')
  span.className = 'badge badge--gray'
  span.textContent = text
  return span
}

function createCharacterBadge({ id, name }) {
  const badge = document.createElement('button')
  badge.type = 'button'
  badge.className = 'badgeCharacter'
  badge.textContent = name
  badge.addEventListener('click', () => {
    window.location.href = baseUrl(`src/pages/characterDetail.html?id=${id}`)
  })
  return badge
}

/**
 * Render badges with expand/collapse behavior.
 * We keep state per card using a closure (no global state needed).
 */
async function renderCharacterBadges(characterUrls, getCharacterName) {
  const wrap = document.createElement('div')
  wrap.className = 'flex flex-wrap gap-2'

  const total = characterUrls.length
  let expanded = false

  // Cache resolved characters to avoid re-fetching on toggle
  const cache = new Map() // url -> {id,name}

  async function resolve(url) {
    if (cache.has(url)) return cache.get(url)
    const data = await getCharacterName(url)
    cache.set(url, data)
    return data
  }

  async function paint() {
    wrap.innerHTML = ''

    const urlsToShow = expanded ? characterUrls : characterUrls.slice(0, MAX_BADGES)

    for (const url of urlsToShow) {
      try {
        const info = await resolve(url)
        wrap.appendChild(createCharacterBadge(info))
      } catch (e) {
        console.error(e)
      }
    }

    const remaining = total - (expanded ? total : urlsToShow.length)
    if (total > MAX_BADGES) {
      const toggle = document.createElement('button')
      toggle.type = 'button'
      toggle.className = 'badge badge--gray'
      toggle.textContent = expanded ? 'Ver menos' : `+${remaining} más`

      toggle.addEventListener('click', async (e) => {
        e.stopPropagation()
        expanded = !expanded
        await paint()
      })

      wrap.appendChild(toggle)
    }
  }

  await paint()
  return wrap
}

export async function renderEpisodesList(list, getCharacterName) {
  if (!el.episodesCardList) return
  el.episodesCardList.innerHTML = ''

  if (!Array.isArray(list) || list.length === 0) {
    const h3 = document.createElement('h3')
    h3.className = 'text-lg font-semibold text-slate-200'
    h3.textContent = 'No hay episodios para mostrar.'
    el.episodesCardList.appendChild(h3)
    return
  }

  for (const episode of list) {
    const card = document.createElement('article')
    card.className = 'card'
    card.dataset.id = episode.id

    // Top row (code + favorite)
    const top = document.createElement('div')
    top.className = 'flex items-center justify-between gap-3'

    const left = document.createElement('div')
    left.className = 'flex items-center gap-2'
    left.appendChild(episodeCodeBadge(episode.episode))

    const count = Array.isArray(episode.characters) ? episode.characters.length : 0
    left.appendChild(pill(`${count} personajes`))

    const favBtn = document.createElement('button')
    favBtn.type = 'button'
    favBtn.className = 'button button--ghost'
    favBtn.textContent = isFavoriteWithPrefix(FAVORITE_EPISODE_PREFIX, episode.id)
      ? 'Favorito ❤️'
      : 'Favorito 🤍'

    favBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      const fav = toggleFavoriteWithPrefix(
        FAVORITE_EPISODE_PREFIX,
        episode.id,
        episode
      )
      favBtn.textContent = fav ? 'Favorito ❤️' : 'Favorito 🤍'
    })

    top.append(left, favBtn)

    // Title
    const title = document.createElement('h3')
    title.className = 'text-xl font-bold tracking-tight'
    title.textContent = episode.name

    // Air date
    const air = document.createElement('p')
    air.className = 'text-sm text-slate-300'
    air.textContent = `Air date: ${episode.air_date || 'Unknown'}`

    // Characters section
    const charsTitle = document.createElement('p')
    charsTitle.className = 'text-sm font-semibold text-slate-200'
    charsTitle.textContent = 'Personajes:'

    const charsWrap = await renderCharacterBadges(
      episode.characters || [],
      getCharacterName
    )

    card.append(top, title, air, charsTitle, charsWrap)
    el.episodesCardList.appendChild(card)
  }
}