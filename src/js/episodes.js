import '../style.css'

// --------------------------------------------
// --- VARIABLES ------------------------------
// --------------------------------------------
const EPISODE_URL = "https://rickandmortyapi.com/api/episode"
let episodesList = []
// ----------------------

// --------------------------------------------
// --- ELEMENTOS DEL DOM ----------------------
// --------------------------------------------
const body = document.querySelector('body')
const cardList = document.getElementById('cardList')
const statusEl = document.getElementById('status')

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

// --------------------------------------------

// --------------------------------------------
// --- FETCH ----------------------------------
// --------------------------------------------
async function getEpisode() {
    try {
        setLoading('Cargando episodios...')

        const response = await fetch(EPISODE_URL)
        const data = await response.json()
        episodesList = data.results
        renderEpisodesList(episodesList)
        clearStatus()
    } catch (err){
        console.log(err)
        setError('No se pudieron cargar los episodios.')
    }
}

async function getCharacters(url_characters, card, p) {
    const response = await fetch(url_characters)
    const data = await response.json()
    const character = data
    renderCharacter(character, card, p)
}
// --------------------------------------------


// --------------------------------------------
// --- RENDER ---------------------------------
// --------------------------------------------
function renderEpisodesList(list) {
    cardList.innerHTML = ''
    list.forEach((episode) => {
        const card = document.createElement('div')
        card.className = 'card'
        card.id = 'card_episodes'
        card.dataset.id = episode.id
        
        // boton favorito
        const favorite = document.createElement('button')
        favorite.id = 'favorite'
        if (localStorage.getItem(`episode.id=${card.dataset.id}`)){
            favorite.textContent = 'Favorito ❤️'
        } else {
            favorite.textContent  = 'Marcar como favorito 🤍'
        }
        card.appendChild(favorite)
        
        favorite.addEventListener('click', () =>{
            if (!localStorage.getItem(`episode.id=${card.dataset.id}`)){
                card.dataset.favorite = true
                favorite.textContent = 'Favorito ❤️'
                localStorage.setItem(`episode.id=${card.dataset.id}`, JSON.stringify(episode))
            } else {
                card.dataset.favorite = false
                favorite.textContent  = 'Marcar como favorito 🤍'
                localStorage.removeItem(`episode.id=${card.dataset.id}`, JSON.stringify(episode))
            }
        })

        cardList.appendChild(card)
        
        
        Object.entries(episode).forEach(([key, value]) =>  {
            if (key === 'name') {
                const h3 = document.createElement('h3')
                h3.textContent = value
                card.appendChild(h3)
            } else {
                if(key !== 'id' && key !== 'characters' && key != 'url'){
                    const p = document.createElement('p')
                    p.textContent = `${key}: ${value}`
                    card.appendChild(p)
                }
                if (key === 'characters') {
                    const p = document.createElement('p')
                    p.textContent = key + ": "
                    
                    Object.entries(value).forEach(character => {
                        getCharacters(character[1], card, p)
                    })
                }
            }
        });
    });
}

function renderCharacter(character, card, p) {
    const span = document.createElement('span')
    span.className = 'badgeCharacter'
    span.dataset.id = character.id
    span.textContent = `${character.name}`
    p.appendChild(span)

    card.appendChild(p)
    p.addEventListener('click', (event) => {
        const span = event.target.closest('.badgeCharacter')
        const id = span.dataset.id
        window.location.href = `/src/pages/characterDetail.html?id=${id}`
    })
}

function renderHeader(){
  const header = document.createElement('header')
  body.prepend(header)


  // Home
  const homeBtn = document.createElement('button')
  homeBtn.id = 'home'
  homeBtn.className = 'button'
  homeBtn.textContent = 'Inicio'
  
  // Favorite Seccion
  const favoriteSection = document.createElement('section')
  favoriteSection.id = "favoriteSeccion"
  // Favorite Button
  const favoriteSectionBtn = document.createElement('button')
  favoriteSectionBtn.id = 'favoriteSectionBtn'
  favoriteSectionBtn.className = 'button'
  favoriteSectionBtn.textContent = "Seccion Favoritos"

  // Episodes Btn
  const episodesBtn = document.createElement('button')
  episodesBtn.id = 'episodesBtn'
  episodesBtn.className = 'button'
  episodesBtn.textContent = 'Episodes'
  
  
  header.appendChild(homeBtn)
  header.appendChild(favoriteSectionBtn)
  header.appendChild(episodesBtn)


  episodesBtn.addEventListener('click', () => {
    window.location.href = '/src/pages/episodes.html'
  })

  favoriteSectionBtn.addEventListener('click', () => {
    const episodeKeys = []
    for (let i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i)
      if (key.startsWith('episode.id')){
        episodeKeys.push(key)
      }
    }
    const localEpisodes = episodeKeys.map(key => {
      const value = localStorage.getItem(key)
      return JSON.parse(value)
    })
    renderEpisodesList(localEpisodes)
  })

  homeBtn.addEventListener('click', () => {
    window.location.href = '/src/index.html'
  }) 
}
// --------------------------------------------

// --------------------------------------------
// --- INIT -----------------------------------
// --------------------------------------------
renderHeader()
getEpisode(EPISODE_URL)
// --------------------------------------------
