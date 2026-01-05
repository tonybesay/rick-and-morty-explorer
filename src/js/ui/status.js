import { el } from '../core/dom'

export function setLoading(message = 'Cargando...') {
  if (!el.status) return
  el.status.className = 'status is-loading'
  el.status.textContent = message
}

export function setError(message = 'Ha ocurrido un error.') {
  if (!el.status) return
  el.status.className = 'status is-error'
  el.status.textContent = message
}

export function clearStatus() {
  if (!el.status) return
  el.status.className = 'status'
  el.status.textContent = ''
}