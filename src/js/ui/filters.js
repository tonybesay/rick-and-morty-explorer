import { el } from '../core/dom'

function resetSelect(selectEl) {
  if (!selectEl) return
  selectEl.innerHTML = ''
  const opt = document.createElement('option')
  opt.value = ''
  opt.textContent = 'Todo'
  selectEl.appendChild(opt)
}

export function buildSelectsFromCharacters(list) {
  if (!el.filterStatus || !el.filterSpecies) return

  const statuses = [...new Set(list.map(c => c.status).filter(Boolean))]
  const species = [...new Set(list.map(c => c.species).filter(Boolean))]

  resetSelect(el.filterStatus)
  resetSelect(el.filterSpecies)

  statuses.forEach((status) => {
    const opt = document.createElement('option')
    opt.value = status.toLowerCase()
    opt.textContent = status
    el.filterStatus.appendChild(opt)
  })

  species.forEach((sp) => {
    const opt = document.createElement('option')
    opt.value = sp.toLowerCase()
    opt.textContent = sp
    el.filterSpecies.appendChild(opt)
  })
}

export function applyFilters(list, filters) {
  let filtered = list

  if (filters.name) {
    filtered = filtered.filter(c => c.name.toLowerCase().includes(filters.name))
  }
  if (filters.status) {
    filtered = filtered.filter(c => c.status.toLowerCase() === filters.status)
  }
  if (filters.species) {
    filtered = filtered.filter(c => c.species.toLowerCase() === filters.species)
  }

  return filtered
}

export function bindFilters(onChange) {
  if (el.filterName) {
    el.filterName.addEventListener('input', (e) => {
      onChange?.({ name: e.target.value.trim().toLowerCase() })
    })
  }

  if (el.filterStatus) {
    el.filterStatus.addEventListener('change', () => {
      onChange?.({ status: el.filterStatus.value })
    })
  }

  if (el.filterSpecies) {
    el.filterSpecies.addEventListener('change', () => {
      onChange?.({ species: el.filterSpecies.value.trim().toLowerCase() })
    })
  }
}