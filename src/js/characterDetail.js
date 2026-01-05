import '../style.css'

// VARIABLES
// ===================
const CHARACTERS_URL = 'https://rickandmortyapi.com/api/character/'
let id = -1
let character = []

// ELEMENTOS DEL DOM
// ===================
const card = document.getElementById('card')
const h1 = document.querySelector('h1')

// FETCH
// ===================
async function loadCharacter(id){
    const response = await fetch(CHARACTERS_URL+id)
    const data = await response.json()
    console.log(typeof data)
    character = data
    console.log(character)
    renderCharacterDetail(data)
}

// FUNCIONES
// ===================
function getIdURL() {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    loadCharacter(id)
}

function renderCharacterDetail(character) {

    card.innerHTML = ''
    const img = document.createElement('img')
    img.src = character.image

    card.appendChild(img)
    for(let value in character) {
        if (value === 'image' || value === 'url' || value === 'created' || value === 'id') continue
        if (value === 'name') {
            h1.textContent = character[value]
        }
        
        // caso default
        let valueFirstUpper = value[0].toLocaleUpperCase() + value.slice(1)
        const p = document.createElement('p')
        p.textContent = valueFirstUpper + ': '
        card.appendChild(p)

        if (value == 'episode' ) {
            character[value].forEach(episode => {
                const span = document.createElement('span')
                const nEpisode = episode.split('/')
                span.textContent = nEpisode[nEpisode.length - 1]+', '
                p.appendChild(span)
                
            });
            continue
        }
        if (value === 'location' || value === 'origin' ) {
            const span = document.createElement('span')
            span.textContent = character[value].name
            p.appendChild(span)
            continue
        }
        // caso de vacío
        if (character[value] === '') {
            const span = document.createElement('span')
            span.textContent = 'Unknown'
            p.appendChild(span)
        }

        const span = document.createElement('span')
        span.textContent = character[value]
        p.appendChild(span)
    };
}

// INIT
// ==================
getIdURL()
