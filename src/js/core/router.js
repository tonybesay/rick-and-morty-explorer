export function baseUrl(path = '') {
  // Vite dev y GitHub Pages
  return `${import.meta.env.BASE_URL}${path}`
}

export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name)
}