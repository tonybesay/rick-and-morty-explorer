# 🧪 Rick and Morty Explorer

Aplicación web para explorar el universo de **Rick and Morty**, desarrollada en **JavaScript Vanilla** y refactorizada con una **arquitectura modular profesional** y **Tailwind CSS**.

El proyecto muestra una evolución clara desde una implementación funcional inicial hasta una versión final optimizada, estructurada y mantenible.

---

## 🚀 Demo

🔗 **Live Demo (GitHub Pages)**  
👉 https://tonybesay.github.io/rick-and-morty-explorer/

---

## 🧠 Descripción del proyecto

Rick and Morty Explorer permite:

- Explorar personajes de la serie
- Filtrar por nombre, estado y especie
- Navegar al detalle de cada personaje
- Explorar episodios
- Guardar personajes y episodios favoritos
- Mantener los favoritos persistentes con `localStorage`

La aplicación consume la **Rick and Morty API pública** y está diseñada como una **Single Page App ligera**, sin frameworks.

---

## 🛠️ Tecnologías utilizadas

### Core
- JavaScript (ES6+)
- HTML5
- CSS3

### Estilos
- Tailwind CSS
- PostCSS
- Autoprefixer

### Tooling
- Vite
- Git & GitHub

### API
- Rick and Morty API  
  https://rickandmortyapi.com/

---

## 📂 Arquitectura del proyecto

```text
El proyecto está estructurado siguiendo una separación clara de responsabilidades:
c/
├── js/
│   ├── core/        # Lógica base (api, router, config, state)
│   ├── pages/       # Controllers por página
│   ├── ui/          # Renderizado de vistas (DOM)
│   ├── storage/     # Persistencia (localStorage)
│
├── pages/           # HTML de vistas secundarias
│
├── style.css        # Tailwind + estilos base

```

### Principios aplicados
- Separación lógica / render
- Controladores por página
- UI desacoplada del estado
- Código reutilizable y mantenible

---

## ✨ Funcionalidades principales

### 🧍 Personajes
- Listado con tarjetas profesionales
- Filtros dinámicos
- Navegación a vista detalle
- Favoritos persistentes

### 📺 Episodios
- Listado de episodios
- Visualización de personajes por episodio
- Expansión y colapso de personajes
- Favoritos independientes

### ⭐ Favoritos
- Guardados en `localStorage`
- Accesibles desde navegación
- Separados por tipo (personajes / episodios)

### ♿ Accesibilidad y UX
- Feedback de carga
- Manejo de errores de red
- Estados visuales claros
- Navegación coherente

---

## 🔁 Evolución del proyecto (Git)

El historial del repositorio refleja claramente la progresión:

1. **Initial implementation (vanilla JavaScript)**  
   - Aplicación funcional
   - Lógica y vistas acopladas

2. **Refactor architecture and UI (Tailwind, modular structure)**  
   - Arquitectura modular
   - Separación por capas
   - UI profesional
   - Tailwind CSS
   - Código limpio y escalable

👉 Esta evolución puede verse en la pestaña **Commits** del repositorio.

---

## ▶️ Cómo ejecutar el proyecto

### Requisitos
- Node.js (v18 o superior recomendado)

### Instalación
```bash
npm install
npm run dev
npm run build
```

## 🧪 Aprendizajes clave
-	Consumo de APIs REST con fetch
-	Manejo de estado sin frameworks
-	Arquitectura modular en JavaScript Vanilla
-	Uso profesional de Tailwind CSS
-	Persistencia con localStorage
-	Flujo de trabajo con Git y commits semánticos

⸻

## 👨‍💻 Autor

Antonio Mendoza Hernández
Full Stack Developer en formación
	•	GitHub: https://github.com/tonybesay
