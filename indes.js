
 // ==========================
 // REFERENCIAS AL DOM
 // ==========================
const peliculasContainer = document.querySelector(".pelis");
const inputBuscador = document.getElementById("buscador");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const numPagina = document.getElementById("num-pagina");

const API_URL = "https://ghibliapi.dev/films";

// ==========================
// ESTADO GLOBAL
// ==========================
let todasLasPeliculas = [];
let peliculasFiltradas = [];
let paginaActual = 1;
const limitePorPagina = 10;

// ==========================
// 1. OBTENER PELÍCULAS DE LA API
// ==========================
async function obtenerPeliculas() {
  peliculasContainer.innerHTML = `
    <div class="mensaje">Cargando películas...</div>
  `;

  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error("No se pudieron obtener las películas");
    }

    const data = await respuesta.json();

    todasLasPeliculas = Array.isArray(data) ? data : [];
    peliculasFiltradas = todasLasPeliculas;
    paginaActual = 1;

    renderizarPaginado();

  } catch (error) {
    console.error("Error al obtener las películas:", error);

    peliculasContainer.innerHTML = `
      <div class="mensaje error">
        No se pudo obtener la información. Intenta más tarde.
      </div>
    `;

   
  }
}

// ==========================
// 2. MOSTRAR PELÍCULAS
// ==========================
function mostrarPeliculas(pelis) {
  peliculasContainer.innerHTML = "";

  if (pelis.length === 0) {
    peliculasContainer.innerHTML = `
      <div class="mensaje">
        No se encontraron resultados.
      </div>
    `;
    return;
  }

  const fragmento = document.createDocumentFragment();

  pelis.forEach((peli) => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("pelicula");

    const titulo = peli.title || "Sin título";
    const poster =
      peli.image ||
      "https://via.placeholder.com/300x450?text=No+Poster";
    const anio = peli.release_date || "N/A";
    const rating = peli.rt_score ? `${peli.rt_score}%` : "N/A";

    tarjeta.innerHTML = `
      <div class="poster-wrapper">
        <img
          src="${poster}"
          alt="${titulo}"
          title="${titulo}"
          loading="lazy"
        >
      </div>

      <h3 class="pelicula-titulo">${titulo}</h3>

      <div class="pelicula-meta">
        <span>${anio}</span>
        <span>⭐ ${rating}</span>
      </div>
    `;

    fragmento.appendChild(tarjeta);
  });

  peliculasContainer.appendChild(fragmento);
}

// ==========================
// 3. PAGINACIÓN
// ==========================
function renderizarPaginado() {
  const totalPaginas = Math.ceil(
    peliculasFiltradas.length / limitePorPagina
  ) || 1;

  // Evitar que la página actual quede fuera del rango
  if (paginaActual > totalPaginas) {
    paginaActual = totalPaginas;
  }

  const inicio = (paginaActual - 1) * limitePorPagina;
  const fin = inicio + limitePorPagina;

  const paginaPeliculas = peliculasFiltradas.slice(inicio, fin);

  mostrarPeliculas(paginaPeliculas);

  numPagina.textContent =
    `Página ${paginaActual} de ${totalPaginas}`;

  btnAnterior.disabled = paginaActual === 1;
  btnSiguiente.disabled = paginaActual >= totalPaginas;
}

// ==========================
// 4. BOTÓN ANTERIOR
// ==========================
btnAnterior.addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    renderizarPaginado();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
});

// ==========================
// 5. BOTÓN SIGUIENTE
// ==========================
btnSiguiente.addEventListener("click", () => {
  const totalPaginas = Math.ceil(
    peliculasFiltradas.length / limitePorPagina
  );

  if (paginaActual < totalPaginas) {
    paginaActual++;
    renderizarPaginado();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
});

// ==========================
// 6. BUSCADOR EN TIEMPO REAL
// ==========================
inputBuscador.addEventListener("input", () => {
const texto=inputBuscador.value.toLowerCase().trim();
if(texto===""){
peliculasFiltradas=todasLasPeliculas;

}

else{
peliculasFiltradas=todasLasPeliculas.filter((peli)=>{
const title=peli.title?.toLowerCase()||"";
const titleOriginal=peli.original_title?.toLowerCase()||"";
return title.includes(texto)||titleOriginal.includes(texto)

})




}
  // Volver a la primera página al buscar
  paginaActual = 1;

  renderizarPaginado();
});

// ==========================
// 7. INICIAR LA APLICACIÓN
// ==========================
obtenerPeliculas();
