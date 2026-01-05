import { el } from '../core/dom'

export function renderLoadMore(nextUrl, onClick) {
  if (!el.loadMore) return
  el.loadMore.innerHTML = ''

  if (!nextUrl) return

  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'button'
  btn.textContent = 'Cargar más'

  btn.addEventListener('click', () => {
    if (typeof onClick === 'function') onClick()
  })

  el.loadMore.appendChild(btn)
}